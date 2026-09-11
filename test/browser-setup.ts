// Next의 클라이언트 모듈은 import 시점에 process.env를 읽는다.
// 브라우저에는 process가 아예 없어 참조만으로 터지므로 최소한의 껍데기를 세운다.
globalThis.process ??= { env: {} } as NodeJS.Process
