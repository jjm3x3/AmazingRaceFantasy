import { fireEvent, waitFor } from "@testing-library/react";
import { render } from "@testing-library/react";
import CheckboxToggle from "../../../app/components/baseComponents/components/inputs/checkboxToggle/checkboxToggle";

const mockOnChange = jest.fn();

describe("CheckboxToggle", ()=> {
    it("should render the checkbox toggle", ()=> {
        const { getByTestId } = render(<CheckboxToggle labelText="Test Label"
                                                        id="test"
                                                        checkboxPosition="left"
                                                        toggleHandler={mockOnChange}/>);
        expect(getByTestId("test-checkboxToggle-label-test")).toBeTruthy();
        expect(getByTestId("test-checkboxToggle-label-test").innerHTML).toBe("Test Label");
        expect(getByTestId("test-checkboxToggle-test")).toBeTruthy();
        expect(getByTestId("test-checkboxToggle-test").checked).toBe(false);
        expect(getByTestId("test-checkboxToggle-test").nextElementSibling).toBe(getByTestId("test-checkboxToggle-label-test"));
    });

    it("should toggle the checkbox", async ()=> {
        const { getByTestId } = render(<CheckboxToggle labelText="Test Label"
                                                        id="test"
                                                        checkboxPosition="left"
                                                        toggleHandler={mockOnChange}/>);
        expect(getByTestId("test-checkboxToggle-test")).toBeTruthy();
        expect(getByTestId("test-checkboxToggle-test").checked).toBe(false);
        fireEvent.click(getByTestId("test-checkboxToggle-test"));
        await waitFor(()=> {
            expect(getByTestId("test-checkboxToggle-test").checked).toBe(true);
        });
    });

    it("should render the checkbox on the right", ()=> {
        const { getByTestId } = render(<CheckboxToggle labelText="Test Label"
                                                        id="test"
                                                        checkboxPosition="right"
                                                        toggleHandler={mockOnChange}/>);
        expect(getByTestId("test-checkboxToggle-test")).toBeTruthy();
        expect(getByTestId("test-checkboxToggle-label-test")).toBeTruthy();
        expect(getByTestId("test-checkboxToggle-test").nextElementSibling).toBeNull();
        expect(getByTestId("test-checkboxToggle-label-test").nextElementSibling).toBe(getByTestId("test-checkboxToggle-test"));
    });
});