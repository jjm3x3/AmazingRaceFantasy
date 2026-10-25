import type { Meta, StoryObj } from "@storybook/react-vite";
import TestComponent from "./testComponent.tsx";

const meta: Meta<typeof TestComponent> = {
    title: "TestComponent",
    component: TestComponent,
    argTypes: {
        exampleProp: {
            control: "text",
            description: "This is the example text prop for the test component",
        }
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        exampleProp: "This is an example prop value",
    },
};