import 'reflect-metadata'

import * as Pack from './Pack'
import * as Unpack from './Unpack'

export const Unspoken = {
  pack:        Pack.pack,
  unpack:      Unpack.unpack,
  unpackIndex: Unpack.unpackIndex,
}

export { indexAt } from './Decorator'
