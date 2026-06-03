package com.heart.service;

import com.heart.model.dto.HeartPartDto;
import com.heart.model.dto.HeartPartDto.LayersDto;
import com.heart.model.dto.HeartPartDto.RelationsDto;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class HeartPartService {

    private Map<String, HeartPartDto> parts;

    @PostConstruct
    void init() {
        parts = Map.ofEntries(
            entry("left-atrium", new HeartPartDto(
                "left-atrium", "左心房", "Left Atrium", "chamber",
                new LayersDto(
                    "左心房位于心脏左上方，壁厚约2-3mm，是四个心腔中壁最薄的。它通过肺静脉接收来自肺部的含氧血，经二尖瓣将血液送入左心室。",
                    "左心房的主要功能是收集和储存肺静脉回流的含氧血，在心室舒张期通过二尖瓣将血液被动和主动地充盈到左心室。",
                    null
                ),
                new RelationsDto(
                    List.of("mitral-valve", "pulmonary-vein"),
                    List.of("left-ventricle"),
                    List.of("pulmonary-vein"),
                    List.of()
                ),
                List.of("pulmonary-loop", "systemic-loop"),
                "左心房的心耳是血栓形成的好发部位，房颤患者尤其需要注意。"
            )),
            entry("left-ventricle", new HeartPartDto(
                "left-ventricle", "左心室", "Left Ventricle", "chamber",
                new LayersDto(
                    "左心室位于心脏左下方，壁厚约13-15mm，是四个心腔中壁最厚的。其厚实的肌壁为体循环提供强大的泵血动力，经主动脉瓣将含氧血射入主动脉。",
                    "左心室是体循环的起始泵，收缩时产生约120mmHg的压力，将含氧血通过主动脉输送到全身各器官和组织，是心脏最重要的功能单元。",
                    null
                ),
                new RelationsDto(
                    List.of("aortic-valve", "mitral-valve"),
                    List.of("aorta"),
                    List.of("left-atrium"),
                    List.of()
                ),
                List.of("systemic-loop"),
                "左心室壁的厚度是右心室的3倍，因为它需要将血液泵到全身而不是仅到肺部。"
            )),
            entry("right-atrium", new HeartPartDto(
                "right-atrium", "右心房", "Right Atrium", "chamber",
                new LayersDto(
                    "右心房位于心脏右上方，接收上腔静脉和下腔静脉回流的脱氧血。窦房结位于右心房上壁，是心脏的天然起搏器。",
                    "右心房收集全身回流的脱氧血，通过三尖瓣将血液送入右心室。窦房结产生电信号控制心跳节律，是心脏传导系统的起点。",
                    null
                ),
                new RelationsDto(
                    List.of("tricuspid-valve", "superior-vena-cava", "inferior-vena-cava"),
                    List.of("right-ventricle"),
                    List.of("superior-vena-cava", "inferior-vena-cava"),
                    List.of()
                ),
                List.of("systemic-loop", "pulmonary-loop"),
                "右心房中的窦房结每分钟产生60-100次电脉冲，是心脏的'司令部'。"
            )),
            entry("right-ventricle", new HeartPartDto(
                "right-ventricle", "右心室", "Right Ventricle", "chamber",
                new LayersDto(
                    "右心室位于心脏右前方，壁厚约3-5mm，明显薄于左心室。它通过肺动脉瓣将脱氧血泵入肺动脉，进入肺循环进行气体交换。",
                    "右心室是肺循环的动力源，收缩时产生约25mmHg的压力（远低于左心室），将脱氧血送入肺部进行氧合，压力较低是因为肺循环阻力远小于体循环。",
                    null
                ),
                new RelationsDto(
                    List.of("pulmonary-valve", "tricuspid-valve"),
                    List.of("pulmonary-artery"),
                    List.of("right-atrium"),
                    List.of()
                ),
                List.of("pulmonary-loop"),
                "右心室虽然壁薄，但在肺循环中不可或缺，肺栓塞时会面临巨大压力负荷。"
            )),
            entry("aorta", new HeartPartDto(
                "aorta", "主动脉", "Aorta", "vessel",
                new LayersDto(
                    "主动脉是人体最大的动脉，直径约2.5-3cm，起始于左心室的主动脉瓣。它先上行形成升主动脉，弯曲形成主动脉弓，再下行形成降主动脉，分支供应全身。",
                    "主动脉接受左心室泵出的含氧血，通过其各级分支将血液输送至全身器官。主动脉壁富有弹性，在心室舒张期通过弹性回缩维持持续的血流。",
                    null
                ),
                new RelationsDto(
                    List.of("aortic-valve"),
                    List.of(),
                    List.of("left-ventricle"),
                    List.of()
                ),
                List.of("systemic-loop"),
                "主动脉每分钟输送约5升血液，一天泵送的血液量足以填满一个小型游泳池。"
            )),
            entry("pulmonary-artery", new HeartPartDto(
                "pulmonary-artery", "肺动脉", "Pulmonary Artery", "vessel",
                new LayersDto(
                    "肺动脉起始于右心室的肺动脉瓣，是唯一运送脱氧血的动脉。它在主动脉弓下方分为左右两支，分别进入左右肺，在肺泡毛细血管处进行气体交换。",
                    "肺动脉将脱氧血从右心室输送到肺部，在肺泡毛细血管中释放二氧化碳并摄取氧气，完成气体交换后变为含氧血经肺静脉回流。",
                    null
                ),
                new RelationsDto(
                    List.of("pulmonary-valve"),
                    List.of(),
                    List.of("right-ventricle"),
                    List.of()
                ),
                List.of("pulmonary-loop"),
                "肺动脉是唯一携带脱氧血的动脉，而肺静脉是唯一携带含氧血的静脉——这是解剖学的有趣反例。"
            )),
            entry("superior-vena-cava", new HeartPartDto(
                "superior-vena-cava", "上腔静脉", "Superior Vena Cava", "vessel",
                new LayersDto(
                    "上腔静脉是收集头部、上肢和胸部的脱氧血回流至右心房的大静脉，长约7cm，由左右头臂静脉汇合而成，开口于右心房上方。",
                    "上腔静脉收集人体上半身的静脉回流，依靠重力辅助和胸腔负压将脱氧血送回右心房，参与完成体循环的回流阶段。",
                    null
                ),
                new RelationsDto(
                    List.of(),
                    List.of(),
                    List.of("right-atrium"),
                    List.of()
                ),
                List.of("systemic-loop"),
                "上腔静脉综合征（SVC综合征）常由肿瘤压迫引起，可导致面部和上肢严重水肿。"
            )),
            entry("inferior-vena-cava", new HeartPartDto(
                "inferior-vena-cava", "下腔静脉", "Inferior Vena Cava", "vessel",
                new LayersDto(
                    "下腔静脉是人体最大的静脉，收集腹部、骨盆和下肢的脱氧血回流至右心房。它沿脊柱右前方上行，穿过膈肌后开口于右心房下方。",
                    "下腔静脉收集人体下半身的静脉回流，携带大量脱氧血返回右心房，其血流量约占全身静脉回流的三分之二。",
                    null
                ),
                new RelationsDto(
                    List.of(),
                    List.of(),
                    List.of("right-atrium"),
                    List.of()
                ),
                List.of("systemic-loop"),
                "下腔静脉的直径可达3cm，是人体管腔最大的静脉，妊娠晚期增大的子宫可压迫它导致仰卧位低血压。"
            )),
            entry("pulmonary-vein", new HeartPartDto(
                "pulmonary-vein", "肺静脉", "Pulmonary Vein", "vessel",
                new LayersDto(
                    "肺静脉共四条（左右各两条），是唯一运送含氧血的静脉。它们从肺部出发，将经过气体交换的含氧血输送至左心房，完成肺循环。",
                    "肺静脉将肺部氧合后的含氧血输送至左心房，是肺循环的最终回流通道，确保含氧血进入体循环供给全身。",
                    null
                ),
                new RelationsDto(
                    List.of(),
                    List.of(),
                    List.of("left-atrium"),
                    List.of()
                ),
                List.of("pulmonary-loop"),
                "肺静脉是房颤射频消融术的重要靶点，因为触发房颤的异常电信号常起源于肺静脉开口处。"
            )),
            entry("tricuspid-valve", new HeartPartDto(
                "tricuspid-valve", "三尖瓣", "Tricuspid Valve", "valve",
                new LayersDto(
                    "三尖瓣位于右心房与右心室之间，由三个瓣叶（前叶、后叶、隔叶）组成，通过腱索与乳头肌相连，防止血液在心室收缩时反流回右心房。",
                    "三尖瓣在心室舒张期开放，允许脱氧血从右心房流入右心室；在心室收缩期关闭，防止血液逆流回右心房，确保血液单向流入肺动脉。",
                    null
                ),
                new RelationsDto(
                    List.of(),
                    List.of("right-ventricle"),
                    List.of("right-atrium"),
                    List.of()
                ),
                List.of("pulmonary-loop"),
                "三尖瓣是心脏中最大的瓣膜，其瓣叶面积约为二尖瓣的两倍。"
            )),
            entry("mitral-valve", new HeartPartDto(
                "mitral-valve", "二尖瓣", "Mitral Valve", "valve",
                new LayersDto(
                    "二尖瓣又称僧帽瓣，位于左心房与左心室之间，由两个瓣叶（前叶和后叶）组成。前叶较大，后叶较小，通过腱索与左心室的乳头肌相连。",
                    "二尖瓣在心室舒张期开放，允许含氧血从左心房流入左心室；在心室收缩期关闭，承受左心室高压，防止血液逆流回左心房，确保血液全部射入主动脉。",
                    null
                ),
                new RelationsDto(
                    List.of(),
                    List.of("left-ventricle"),
                    List.of("left-atrium"),
                    List.of()
                ),
                List.of("systemic-loop"),
                "二尖瓣脱垂是最常见的心脏瓣膜疾病，影响约2%的人群，多数无需治疗。"
            )),
            entry("pulmonary-valve", new HeartPartDto(
                "pulmonary-valve", "肺动脉瓣", "Pulmonary Valve", "valve",
                new LayersDto(
                    "肺动脉瓣位于右心室出口与肺动脉之间，由三个半月形瓣叶组成，是右心室流出道的最后一道关卡。",
                    "肺动脉瓣在心室收缩期开放，允许脱氧血从右心室射入肺动脉进入肺循环；在心室舒张期关闭，防止肺动脉中的血液反流回右心室。",
                    null
                ),
                new RelationsDto(
                    List.of(),
                    List.of("pulmonary-artery"),
                    List.of("right-ventricle"),
                    List.of()
                ),
                List.of("pulmonary-loop"),
                "肺动脉瓣是最少发生病变的心脏瓣膜，但先天性肺动脉瓣狭窄是最常见的先天性心脏病之一。"
            )),
            entry("aortic-valve", new HeartPartDto(
                "aortic-valve", "主动脉瓣", "Aortic Valve", "valve",
                new LayersDto(
                    "主动脉瓣位于左心室出口与主动脉之间，由三个半月形瓣叶组成（左冠瓣、右冠瓣、无冠瓣），其中左右冠瓣的开口分别是左右冠状动脉的入口。",
                    "主动脉瓣在心室收缩期开放，允许含氧血从左心室射入主动脉进入体循环；在心室舒张期关闭，承受主动脉高压，防止血液反流回左心室，同时保证冠状动脉灌注。",
                    null
                ),
                new RelationsDto(
                    List.of(),
                    List.of("aorta"),
                    List.of("left-ventricle"),
                    List.of()
                ),
                List.of("systemic-loop"),
                "主动脉瓣承受的压力是所有心脏瓣膜中最大的，这也是它最容易发生退行性病变的原因之一。"
            )),
            entry("septum", new HeartPartDto(
                "septum", "室间隔", "Septum", "structure",
                new LayersDto(
                    "室间隔是分隔左右心室的厚实肌壁，上部较薄为膜部，下部厚实为肌部。室间隔的存在确保含氧血和脱氧血互不混合，是体循环和肺循环独立运行的关键结构。",
                    "室间隔在心室收缩期与左右心室壁协同收缩，为两侧心室提供结构支撑。室间隔膜部是室间隔缺损的好发部位，缺损会导致左右心血液异常分流。",
                    null
                ),
                new RelationsDto(
                    List.of("left-ventricle", "right-ventricle"),
                    List.of(),
                    List.of(),
                    List.of()
                ),
                List.of("systemic-loop", "pulmonary-loop"),
                "先天性室间隔缺损是最常见的先天性心脏病，约占所有先心病的25-30%。"
            ))
        );
    }

    public List<HeartPartDto> findAll() {
        return List.copyOf(parts.values());
    }

    public Optional<HeartPartDto> findById(String id) {
        return Optional.ofNullable(parts.get(id));
    }

    private static Map.Entry<String, HeartPartDto> entry(String key, HeartPartDto value) {
        return Map.entry(key, value);
    }
}
