// 校验手机号
export function isMobile(mobile) {
  return /^1[3-9]\d{9}$/.test(mobile);
}

// 分页配置数据
export const form = {
  total: 0,
  page: 1,
  size: 30,
  pager: 5,
  layout: window.screen.availWidth > 768 ? 'prev, pager, next, jumper, total' : 'prev, next, total'
};
