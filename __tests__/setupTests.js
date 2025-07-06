// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "jose";

Object.assign(global, { TextDecoder, TextEncoder });