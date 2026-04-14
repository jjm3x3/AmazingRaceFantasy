import type { Meta, StoryObj } from "@storybook/react-vite";
import Select from "./select";

const meta: Meta<typeof Select> = {
    title: "Select",
    component: Select,
    argTypes: {
        labelText: {
            control: "text",
            description: "The label text for the select element",
        },
        placeholder: {
            control: "text",
            description: "Placeholder text shown as the first disabled option",
        },
        selectOptions: {
            control: "object",
            description: "Array of options for the select dropdown",
        },
        changeHandler: {
            action: "changed",
            description: "Handler called when the select value changes",
        },
        id: {
            control: "text",
            description: "Unique identifier for the select element",
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOptions = [
    { value: "option1", text: "Option 1" },
    { value: "option2", text: "Option 2" },
    { value: "option3", text: "Option 3" },
];

export const Default: Story = {
    args: {
        labelText: "Choose an option",
        selectOptions: sampleOptions,
        id: "default-select",
    },
};