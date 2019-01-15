import storageMiddleware from '../../middlewares/storageMiddleware'

/**
 * This is a "fake" middleware caller
 * Taken from https://redux.js.org/recipes/writing-tests#middleware
 */

let state
let account
let lock
let network

const create = () => {
  const store = {
    getState: jest.fn(() => state),
    dispatch: jest.fn(() => true),
  }
  const next = jest.fn()
  const handler = storageMiddleware(store)
  const invoke = action => handler(next)(action)
  return { next, invoke, store }
}

let mockStoreLockDetails = jest.fn(() => Promise.resolve())
let mockUpdateLockDetails = jest.fn(() => Promise.resolve())
let mockLockLookUp = jest.fn(() => Promise.resolve())

jest.mock('../../services/storageService', () => () => ({
  storeLockDetails: mockStoreLockDetails,
  updateLockDetails: mockUpdateLockDetails,
  lockLookUp: mockLockLookUp,
}))

describe('Storage middleware', () => {
  beforeEach(() => {
    account = {
      address: '0xabc',
    }
    network = {
      name: 'test',
    }
    lock = {
      address: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      keyPrice: '100',
      owner: account.address,
    }
    state = {
      account,
      network,
      provider: 'HTTP',
      locks: {
        [lock.address]: lock,
      },
      keys: {},
    }
  })

  describe('handling STORE_LOCK_CREATION', () => {
    it('dispatches to the appropriate storage middleware handler', () => {
      const { next, invoke } = create()
      const action = { type: 'STORE_LOCK_CREATION' }
      invoke(action)
      expect(mockStoreLockDetails).toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
    })
  })

  describe('handling UPDATE_LOCK', () => {
    describe('when the update is a transaction', () => {
      it('calls the next middleware', () => {
        const { next, invoke } = create()
        const action = { type: 'UPDATE_LOCK', update: { transaction: 'foo' } }
        invoke(action)
        expect(mockLockLookUp).not.toBeCalled()
        expect(next).toHaveBeenCalledTimes(1)
      })
    })
    describe('when the update is not a transaction', () => {
      it('dispatches to the appropriate storage middleware handler', () => {
        const { next, invoke } = create()
        const action = { type: 'UPDATE_LOCK', update: { foo: 'foo' } }
        invoke(action)
        expect(mockLockLookUp).toBeCalled()
        expect(next).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('handling STORE_LOCK_UPDATE', () => {
    describe('when the lock and new details are provide', () => {
      it('dispatches to the appropriate storage middleware handler', () => {
        const { next, invoke } = create()
        const action = {
          type: 'STORE_LOCK_UPDATE',
          address: '0xfff',
          lock: { address: '0x3f3f3' },
        }
        invoke(action)
        expect(mockLockLookUp).toBeCalled()
        expect(next).toHaveBeenCalledTimes(1)
      })
    })

    // describe('when lock or new details are not provided', () => {
    //   it('does not dispatch to the appropriate storage middleware handler', () => {
    //     mockWeb3Service.ready = true
    //     const { next, invoke } = create()
    //     const action = { type: 'LOCK_DEPLOYED', address: '0x2223' }
    //     invoke(action)
    //     expect(storageMiddlewareHander.lockDeployed).not.toBeCalled()
    //     expect(next).toHaveBeenCalledTimes(1)
    //   })
    // })
  })
})
