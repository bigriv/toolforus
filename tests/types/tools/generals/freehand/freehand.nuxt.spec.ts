import { expect, it } from "vitest";
import { TOUColor } from "@/types/common/color/color";
import { TOUFreehandNote } from "@/types/tools/generals/freehand/freehand";
import {
  TOUFreehandNoteDraw,
  TOUFreehandNoteClear,
} from "@/types/tools/generals/freehand/operation";

it("TOUFreehand constructor", () => {
  const freehand = new TOUFreehandNote();
  expect(freehand.current).toBe(-1);
  expect(freehand.log).toMatchObject([]);
});

const operation1 = new TOUFreehandNoteDraw({
  x: 0,
  y: 0,
  color: new TOUColor(TOUColor.CODE_WHITE),
  size: 1,
});
const operation2 = new TOUFreehandNoteDraw({
  x: 10,
  y: 20,
  color: new TOUColor(TOUColor.CODE_BLACK),
  size: 8,
});
const operation3 = new TOUFreehandNoteClear();
const ADD_TEST_DATAS = [
  {
    name: "事前データなし",
    initLog: [],
    initCurrent: -1,
    adding: operation1,
    expected: {
      current: 0,
      log: [operation1],
    },
  },
  {
    name: "事前データあり_初期位置終端",
    initLog: [operation1, operation2],
    initCurrent: 1,
    adding: operation3,
    expected: {
      current: 2,
      log: [operation1, operation2, operation3],
    },
  },
  {
    name: "事前データあり_初期位置先頭",
    initLog: [operation1, operation2],
    initCurrent: -1,
    adding: operation3,
    expected: {
      current: 0,
      log: [operation3],
    },
  },
  {
    name: "事前データあり_初期位置先頭から終端の間",
    initLog: [operation1, operation2],
    initCurrent: 0,
    adding: operation3,
    expected: {
      current: 1,
      log: [operation1, operation3],
    },
  },
];
for (const data of ADD_TEST_DATAS) {
  it(`TOUFreehand add ${data.name}`, () => {
    const freehand = new TOUFreehandNote();
    freehand.log = data.initLog;
    freehand.current = data.initCurrent;
    freehand.add(data.adding);
    expect(freehand.current).toBe(data.expected.current);
    expect(freehand.log).toMatchObject(data.expected.log);
  });
}

const GOBACK_TEST_DATAS = [
  {
    name: "事前データなし",
    initLog: [],
    initCurrent: -1,
    expected: {
      current: -1,
    },
  },
  {
    name: "事前データあり_初期位置先頭",
    initLog: [operation1, operation2],
    initCurrent: -1,
    expected: {
      current: -1,
    },
  },
  {
    name: "事前データあり_初期位置先頭以外",
    initLog: [operation1, operation2],
    initCurrent: 1,
    expected: {
      current: 0,
    },
  },
];
for (const data of GOBACK_TEST_DATAS) {
  it(`TOUFreehand goBack ${data.name}`, () => {
    const freehand = new TOUFreehandNote();
    freehand.log = data.initLog;
    freehand.current = data.initCurrent;
    freehand.goBack();
    expect(freehand.current).toBe(data.expected.current);
  });
}

const GOFORWARD_TEST_DATAS = [
  {
    name: "事前データなし",
    initLog: [],
    initCurrent: -1,
    expected: {
      current: -1,
    },
  },
  {
    name: "事前データあり_初期位置終端",
    initLog: [operation1, operation2],
    initCurrent: 1,
    expected: {
      current: 1,
    },
  },
  {
    name: "事前データあり_初期位置終端以外",
    initLog: [operation1, operation2],
    initCurrent: -1,
    expected: {
      current: 0,
    },
  },
];
for (const data of GOFORWARD_TEST_DATAS) {
  it(`TOUFreehand goForward ${data.name}`, () => {
    const freehand = new TOUFreehandNote();
    freehand.log = data.initLog;
    freehand.current = data.initCurrent;
    freehand.goForward();
    expect(freehand.current).toBe(data.expected.current);
  });
}
