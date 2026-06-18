/**
 * 响应式对象工具函数
 * @description 操作 Vue reactive 对象的实用方法
 */

/**
 * 清空响应式对象的所有 key 并重新赋值，保持同一引用不变
 * @description 用于 watch 回调中同步外部数据到内部 reactive 对象。
 * 先删除所有已有 key，再通过 Object.assign 写入新数据，
 * 确保 reactive 引用不变（不会触发依赖该引用的 computed / template 重新绑定）。
 * @param target - 要清空并重赋值的响应式对象
 * @param source - 新的数据源
 * @example
 * const formValue = reactive<Record<string, unknown>>({})
 * // 外部数据变化时同步
 * clearAndReassign(formValue, newFormData)
 */
export function clearAndReassign(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): void {
  // 删除所有已有 key，确保不会残留旧字段
  for (const key of Object.keys(target)) {
    delete target[key]
  }
  // 写入新数据，保持 target 的响应式引用不变
  Object.assign(target, source)
}
