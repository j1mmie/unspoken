import { getIndexingMetas } from '../src/Meta'

test('getIndexingMetas returns [] for undefined object', () => {
  const metas = getIndexingMetas(undefined)
  expect(metas).toEqual([])
})