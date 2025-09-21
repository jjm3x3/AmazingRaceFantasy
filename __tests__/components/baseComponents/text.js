import { fireEvent, waitFor } from "@testing-library/react";
import { render } from "@testing-library/react";
import TextInput from "../../../app/components/baseComponents/components/inputs/text/text";

describe("Text", ()=> {
    it("should render the text", ()=> {
        const { getByTestId } = render(<TextInput label="Test Label"
                                                  placeholder="ex. test placeholder"
                                                  isRequired={true}
                                                  id="text-input"/>);
        expect(getByTestId("test-label-text-input")).toBeTruthy()
        expect(getByTestId("test-label-text-input").innerHTML).toBe("Test Label")
        expect(getByTestId("test-input-text-input")).toBeTruthy()
        expect(getByTestId("test-input-text-input").placeholder).toBe("ex. test placeholder")
        expect(document.querySelector("[data-testid='test-label-text-input-icon']")).toBeFalsy()
    });

    it("should validate the input", ()=> {
        const { getByTestId } = render(<TextInput label="Test Label"
                                                  placeholder="ex. test placeholder"
                                                  isRequired={true}
                                                  id="text-input"/>);
        expect(getByTestId("test-input-text-input")).toBeTruthy()
        expect(getByTestId("test-input-text-input").value).toBe("")
        expect(document.querySelector("[data-testid='test-label-text-input-icon']")).toBeFalsy()
        fireEvent.change(getByTestId("test-input-text-input"), {target: {value: "abc123!@#"}})
        waitFor(()=> {
            expect(getByTestId("test-input-text-input").value).toBe("abc123!@#")
            expect(getByTestId("test-label-text-input-icon")).toBeTruthy()
            expect(getByTestId("test-label-text-input-msg")).toBeTruthy()
        })
        fireEvent.change(getByTestId("test-input-text-input"), {target: {value: "abc123"}})
        waitFor(()=> {
            expect(getByTestId("test-input-text-input").value).toBe("abc123")
            expect(document.querySelector("[data-testid='test-label-text-input-icon']")).toBeFalsy()
            expect(document.querySelector("[data-testid='test-label-text-input-msg']")).toBeFalsy()
        })
    });
})