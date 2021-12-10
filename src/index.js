import $ from "jquery";
import "./css/index.css";
import "./css/app.scss";

// 引入其他 js 檔案方式
import { add } from '@/utils';
import foo from './IMHappyCode'

console.log("add:" + add(1, 1));
console.log("i'm_happy", foo(2, 3));

$(() => {
  console.log('hi jQuery Ready');
});

const array01 = ["aaa", "bbb"]
const array02 = ["aaa", "bbb"]
const arrayAll = [...array01, ...array02]
console.log(arrayAll);


