// @flow
import jestSetup from '../jestSetup'

import {AddressChain, AddressGenerator} from './chain'

jestSetup.setup()

const getAddr = (i) => `Addr${i}`

describe('AddressChain', () => {
  let chain
  let used
  const filterFn = (addrs) =>
    Promise.resolve(addrs.filter((addr) => used.map(getAddr).includes(addr)))

  beforeEach(() => {
    used = []
    chain = new AddressChain(
      // $FlowFixMe (this is a mock)
      {
        generate: (ids) => Promise.resolve(ids.map(getAddr)),
      },
      5 /* block size */,
      2 /* gap limit */,
    )
  })

  it('starts with some addresses', async () => {
    expect.assertions(1)
    await chain.initialize()
    expect(chain.size()).toBe(5)
  })

  it('follows discovery', async () => {
    expect.assertions(5)
    used = []
    await chain.initialize()
    await chain.sync(filterFn)
    expect(chain.size()).toBe(5)

    used.push(1)
    await chain.sync(filterFn)
    expect(chain.size()).toBe(5)

    used.push(0)
    used.push(2)
    await chain.sync(filterFn)
    expect(chain.size()).toBe(5)

    used.push(3)
    await chain.sync(filterFn)
    expect(chain.size()).toBe(10)

    used.push(9)
    used.push(14)
    used.push(19)
    await chain.sync(filterFn)
    expect(chain.size()).toBe(25)
  })

  it('provides correct indexOf', async () => {
    expect.assertions(4)

    used = [4, 9]
    await chain.initialize()
    await chain.sync(filterFn)
    expect(chain.size()).toBe(15)
    expect(chain.getIndexOfAddress(getAddr(4))).toBe(4)
    expect(chain.getIndexOfAddress(getAddr(7))).toBe(7)
    expect(chain.getIndexOfAddress(getAddr(14))).toBe(14)
  })

  it('throws on bad indexOf', async () => {
    expect.assertions(1)

    await chain.initialize()
    expect(() => {
      chain.getIndexOfAddress('wrong')
    }).toThrow()
  })

  it('can continue after rehydrating', async () => {
    const account = {
      derivation_scheme: 'V2',
      root_cached_key:
        '7f53efa3c08093db3824235769079e96ef96b6680fc254f6c021ec420e4d1555' +
        'b5bafb0b1fc6c8040cc8f69f7c1948dfb4dcadec4acd09730c0efb39c6159362',
    }
    chain = new AddressChain(new AddressGenerator(account, 'Internal'), 5, 2)

    expect.assertions(2)

    await chain.initialize()

    const data = chain.toJSON()
    const chain2 = AddressChain.fromJSON(data)

    const used = ['Ae2tdPwUPEZFVwV6LJYdEMUAChDW6L6v97WdKjqVb4TzyKmR31otsidBnJx']

    const filter = (addresses) => {
      return Promise.resolve(addresses.filter((addr) => used.includes(addr)))
    }

    await chain.sync(filter)
    await chain2.sync(filter)
    expect(chain.size()).toBe(10)
    expect(chain2.addresses).toEqual(chain.addresses)
  })
})
