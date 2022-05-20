import { EventEmitterService } from "services/eventEmitter";

jest.autoMockOn();
jest.mock("../../src/services/eventEmitter.ts");

export const EventEmitterServiceMock = EventEmitterService as jest.MockedClass<
	typeof EventEmitterService
>;

beforeEach(() => {
	EventEmitterServiceMock.mockClear();
});
