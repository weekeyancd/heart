"""
Heart parametric model generator.

Generates a 14-part anatomical heart model using trimesh,
annotates each mesh with glTF extras (partId, type), and exports as GLB.
"""

import trimesh
import numpy as np
from pygltflib import GLTF2
import os


def make_ellipsoid(rx, ry, rz, cx, cy, cz, subdivisions=3):
    """Create an ellipsoid by scaling icosphere vertices."""
    mesh = trimesh.creation.icosphere(subdivisions=subdivisions)
    v = mesh.vertices.copy()
    v[:, 0] *= rx
    v[:, 1] *= ry
    v[:, 2] *= rz
    mesh.vertices = v + np.array([cx, cy, cz])
    return mesh


def make_cylinder(radius, height, cx, cy, cz, tilt_axis=None, tilt_angle=0, sections=16):
    """Create a cylinder at position with optional tilt."""
    mesh = trimesh.creation.cylinder(radius=radius, height=height, sections=sections)
    if tilt_axis is not None and tilt_angle != 0:
        R = trimesh.transformations.rotation_matrix(tilt_angle, tilt_axis)
        mesh.apply_transform(R)
    mesh.apply_transform(trimesh.transformations.translation_matrix([cx, cy, cz]))
    return mesh


def make_valve_disc(radius, thickness, cx, cy, cz, tilt_axis=None, tilt_angle=0,
                    sections=16):
    """Create a valve as a short cylinder (disc/ring shape)."""
    mesh = trimesh.creation.cylinder(radius=radius, height=thickness, sections=sections)
    if tilt_axis is not None and tilt_angle != 0:
        R = trimesh.transformations.rotation_matrix(tilt_angle, tilt_axis)
        mesh.apply_transform(R)
    mesh.apply_transform(trimesh.transformations.translation_matrix([cx, cy, cz]))
    return mesh


def make_box(sx, sy, sz, cx, cy, cz):
    """Create a box centered at position."""
    mesh = trimesh.creation.box(extents=[sx, sy, sz])
    mesh.apply_transform(trimesh.transformations.translation_matrix([cx, cy, cz]))
    return mesh


def generate_heart_parts():
    """Generate all 14 heart parts.

    Coordinate system (front view):
      X: observer left(-) to right(+)
      Y: down(-) to up(+)
      Z: back(-) to front(+)
    """
    parts = {}

    # --- Chambers (4) ---
    # Right side: observer's left (negative X), anterior (positive Z)
    # Right atrium: upper-right, anterior, deoxy
    parts['right-atrium'] = make_ellipsoid(0.55, 0.45, 0.45, -0.40, 0.50, 0.22)
    # Right ventricle: lower-right, more anterior
    parts['right-ventricle'] = make_ellipsoid(0.55, 0.70, 0.48, -0.28, -0.18, 0.30)
    # Left atrium: upper-left, posterior, oxy
    parts['left-atrium'] = make_ellipsoid(0.50, 0.42, 0.42, 0.38, 0.48, -0.12)
    # Left ventricle: lower-left, thicker, elongated
    parts['left-ventricle'] = make_ellipsoid(0.52, 0.82, 0.48, 0.28, -0.22, 0.06)

    # --- Vessels (5) ---
    # Aorta: center-top, large
    parts['aorta'] = make_cylinder(0.22, 1.3, 0.02, 1.20, 0.05)
    # Pulmonary artery: from RV upward, anterior, slight tilt
    parts['pulmonary-artery'] = make_cylinder(
        0.17, 1.1, -0.25, 1.05, 0.32,
        tilt_axis=[0, 0, 1], tilt_angle=0.15)
    # Superior vena cava: into RA from above
    parts['superior-vena-cava'] = make_cylinder(0.14, 0.9, -0.55, 1.10, 0.10)
    # Inferior vena cava: into RA from below
    parts['inferior-vena-cava'] = make_cylinder(0.14, 0.8, -0.55, -0.50, 0.05)
    # Pulmonary vein: into LA from behind (rotated 90° on X)
    pv = trimesh.creation.cylinder(radius=0.12, height=0.7, sections=16)
    pv.apply_transform(trimesh.transformations.rotation_matrix(np.pi / 2, [1, 0, 0]))
    pv.apply_transform(trimesh.transformations.translation_matrix([0.52, 0.50, -0.48]))
    parts['pulmonary-vein'] = pv

    # --- Valves (4) - thin discs ---
    # Tricuspid: between RA and RV
    parts['tricuspid-valve'] = make_valve_disc(
        0.25, 0.06, -0.34, 0.18, 0.24,
        tilt_axis=[1, 0, 0], tilt_angle=0.25)
    # Mitral: between LA and LV
    parts['mitral-valve'] = make_valve_disc(
        0.22, 0.06, 0.32, 0.15, 0.02,
        tilt_axis=[1, 0, 0], tilt_angle=0.25)
    # Pulmonary valve: base of pulmonary artery
    parts['pulmonary-valve'] = make_valve_disc(
        0.15, 0.04, -0.25, 0.60, 0.32, sections=12)
    # Aortic valve: base of aorta
    parts['aortic-valve'] = make_valve_disc(
        0.18, 0.04, 0.02, 0.65, 0.05, sections=12)

    # --- Structure (1) ---
    # Septum: wall between left and right chambers
    parts['septum'] = make_box(0.06, 1.10, 0.85, 0.0, 0.10, 0.08)

    return parts


# Color: oxy=red, deoxy=blue-purple, valve=pale, structure=muscular
COLOR_MAP = {
    'right-atrium':       [0.55, 0.22, 0.30, 1.0],
    'right-ventricle':    [0.50, 0.18, 0.32, 1.0],
    'left-atrium':        [0.82, 0.22, 0.18, 1.0],
    'left-ventricle':     [0.88, 0.16, 0.16, 1.0],
    'aorta':              [0.85, 0.24, 0.18, 1.0],
    'pulmonary-artery':   [0.48, 0.24, 0.40, 1.0],
    'superior-vena-cava': [0.40, 0.22, 0.42, 1.0],
    'inferior-vena-cava': [0.42, 0.22, 0.38, 1.0],
    'pulmonary-vein':     [0.80, 0.28, 0.22, 1.0],
    'tricuspid-valve':    [0.88, 0.80, 0.68, 1.0],
    'mitral-valve':       [0.88, 0.80, 0.68, 1.0],
    'pulmonary-valve':    [0.84, 0.76, 0.64, 1.0],
    'aortic-valve':       [0.84, 0.76, 0.64, 1.0],
    'septum':             [0.78, 0.38, 0.40, 1.0],
}


def get_part_type(part_id):
    if part_id in ('left-atrium', 'left-ventricle', 'right-atrium', 'right-ventricle'):
        return 'chamber'
    if part_id in ('aorta', 'pulmonary-artery', 'superior-vena-cava',
                   'inferior-vena-cava', 'pulmonary-vein'):
        return 'vessel'
    if part_id in ('tricuspid-valve', 'mitral-valve', 'pulmonary-valve', 'aortic-valve'):
        return 'valve'
    return 'structure'


def export_glb(parts, output_path):
    """Export all parts as GLB with vertex colors."""
    scene = trimesh.Scene()

    for part_id in sorted(parts):
        mesh = parts[part_id]
        color = COLOR_MAP.get(part_id, [0.7, 0.7, 0.7, 1.0])

        vertex_colors = np.tile(
            (np.array(color) * 255).astype(np.uint8),
            (len(mesh.vertices), 1)
        )
        mesh.visual = trimesh.visual.ColorVisuals(mesh, vertex_colors=vertex_colors)
        scene.add_geometry(mesh, node_name=part_id, geom_name=part_id)

    glb_data = scene.export(file_type='glb')
    with open(output_path, 'wb') as f:
        f.write(glb_data)


def add_extras(glb_path, output_path):
    """Add extras { partId, type } to each mesh node in the GLB."""
    gltf = GLTF2().load(glb_path)

    for node in gltf.nodes:
        if node.mesh is not None:
            mesh_obj = gltf.meshes[node.mesh]
            name = mesh_obj.name or ""
            ptype = get_part_type(name)
            node.extras = {'partId': name, 'type': ptype}
            mesh_obj.extras = {'partId': name, 'type': ptype}

    gltf.save(output_path)


def validate(parts):
    """Check all 14 expected parts exist."""
    expected = [
        'left-atrium', 'left-ventricle', 'right-atrium', 'right-ventricle',
        'aorta', 'pulmonary-artery', 'superior-vena-cava', 'inferior-vena-cava',
        'pulmonary-vein', 'tricuspid-valve', 'mitral-valve',
        'pulmonary-valve', 'aortic-valve', 'septum'
    ]
    missing = [p for p in expected if p not in parts]
    extra = [p for p in parts if p not in expected]

    if missing:
        print(f"  MISSING: {missing}")
    if extra:
        print(f"  EXTRA: {extra}")
    if not missing and not extra:
        print("  All 14 parts present")

    for pid in sorted(parts):
        m = parts[pid]
        print(f"  {pid:25s} type={get_part_type(pid):9s} faces={len(m.faces):5d}")


def main():
    out_dir = '/home/app/heart/frontend/public/models'
    os.makedirs(out_dir, exist_ok=True)

    raw_path = os.path.join(out_dir, 'heart_raw.glb')
    final_path = os.path.join(out_dir, 'heart.glb')

    print("Generating 14 heart parts...")
    parts = generate_heart_parts()

    print("Exporting GLB...")
    export_glb(parts, raw_path)

    print("Annotating extras...")
    add_extras(raw_path, final_path)
    os.remove(raw_path)

    print("\n--- Validation ---")
    validate(parts)

    size = os.path.getsize(final_path)
    print(f"\nFile: {final_path}")
    print(f"Size: {size:,} bytes ({size/1024:.1f} KB)")


if __name__ == '__main__':
    main()
