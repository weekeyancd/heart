export const GUIDED_STEPS = [
  {
    partId: 'right-atrium',
    instruction: '我们从右心房开始——这是全身脱氧血回流的第一站。上腔静脉和下腔静脉将血液送入此处。',
  },
  {
    partId: 'tricuspid-valve',
    instruction: '三尖瓣控制血液从右心房流向右心室，防止反流。注意它有三个瓣叶。',
  },
  {
    partId: 'right-ventricle',
    instruction: '右心室将脱氧血泵向肺部。它的壁比左心室薄，因为肺循环的压力较低。',
  },
  {
    partId: 'pulmonary-valve',
    instruction: '肺动脉瓣是右心室的出口，确保血液只朝肺动脉方向流动。',
  },
  {
    partId: 'pulmonary-artery',
    instruction: '肺动脉是唯一携带脱氧血的动脉。它将血液送到肺部进行气体交换。',
  },
  {
    partId: 'pulmonary-vein',
    instruction: '在肺部完成氧合后，含氧血通过肺静脉回到心脏——肺静脉是唯一携带含氧血的静脉。',
  },
  {
    partId: 'left-atrium',
    instruction: '左心房接收来自肺静脉的含氧血，是四个心腔中壁最薄的。',
  },
  {
    partId: 'mitral-valve',
    instruction: '二尖瓣（僧帽瓣）连接左心房和左心室，承受左心室的高压，防止血液反流。',
  },
  {
    partId: 'left-ventricle',
    instruction: '左心室是心脏最强壮的腔室，壁厚是右心室的3倍，负责将含氧血泵向全身。',
  },
  {
    partId: 'aortic-valve',
    instruction: '主动脉瓣承受所有瓣膜中最大的压力，它的瓣叶开口也是冠状动脉的入口。',
  },
  {
    partId: 'aorta',
    instruction: '主动脉是人体最大的动脉，将含氧血输送到全身各个器官。',
  },
  {
    partId: 'septum',
    instruction: '室间隔分隔左右心室，确保含氧血和脱氧血互不混合。先天性缺损是最常见的先心病。',
  },
] as const

export type GuidedStep = (typeof GUIDED_STEPS)[number]
