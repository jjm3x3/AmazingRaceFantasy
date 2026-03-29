import { fireEvent } from "@testing-library/react";
import { render } from "@testing-library/react";
import Select from "../../../app/components/baseComponents/components/inputs/select/select";

describe("Select", () => {
    it("renders the select control, label, and placeholder", () => {
        const options = [
            { value: "option1", text: "Option 1" },
            { value: "option2", text: "Option 2" }
        ];

        const { getByTestId } = render(
            <Select
                labelText="Choose"
                placeholder="Please choose..."
                selectOptions={options}
                id="test"
            />
        );

        const selectByTestId = getByTestId("test-select-test");
        expect(selectByTestId).toBeInTheDocument();

        expect(selectByTestId.options[0].textContent).toBe("Please choose...");
        expect(selectByTestId.querySelectorAll("option")).toHaveLength(3); // placeholder + 2 options
    });

    it("renders options and triggers changeHandler", () => {
        const options = [
            { value: "red", text: "Red" },
            { value: "blue", text: "Blue" }
        ];
        const onChange = jest.fn();

        const { getByTestId } = render(
            <Select
                labelText="Color"
                placeholder=""
                selectOptions={options}
                changeHandler={onChange}
                id="color"
            />
        );

        const select = getByTestId("test-select-color");
        expect(select).toBeInTheDocument();

        fireEvent.change(select, { target: { value: "blue" } });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(select.value).toBe("blue");
    });

    it("does not render a placeholder option when placeholder is not provided", () => {
        const options = [{ value: "x", text: "X" }];

        const { getByTestId } = render(
            <Select
                labelText="Alpha"
                selectOptions={options}
                id="alpha"
            />
        );

        const select = getByTestId("test-select-alpha");
        expect(select.querySelectorAll("option")).toHaveLength(1);
    });
});