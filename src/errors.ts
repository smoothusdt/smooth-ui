export abstract class SmoothError extends Error {
    // Should always be overriden.
    // There is  no way to enforce a static property to be overridden in typescript :(
    static code: string

    toJson(): any {
        return {
            code: (this.constructor as any).code
        }
    }
}

export abstract class PinError extends SmoothError { }

export class UnknownDeviceIdError extends PinError {
    static code = "unknown-device-id";
}

export class TooManyAttemptsError extends PinError {
    static code = "too-many-attempts"
}

export class WrongPinError extends PinError {
    static code = "wrong-pin"
    remainingAttempts: number

    constructor(remainingAttempts: number) {
        super()
        this.remainingAttempts = remainingAttempts
    }

    toJson(): any {
        return {
            code: (this.constructor as any).code,
            remainingAttempts: this.remainingAttempts
        }
    }
}

// Accepts an object with a mandatory "code" property and constructs
// an error out of it.
export function makeError(obj: any): SmoothError {
    const code: string = obj.code
    switch (code) {
        case UnknownDeviceIdError.code:
            return new UnknownDeviceIdError()
        case TooManyAttemptsError.code:
            return new TooManyAttemptsError()
        case WrongPinError.code:
            return new WrongPinError(obj.remainingAttempts)
        default:
            throw new Error(`Unrecognized error code ${code}`)
    }
}