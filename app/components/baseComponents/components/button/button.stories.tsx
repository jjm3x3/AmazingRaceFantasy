import type { Meta, StoryObj } from "@storybook/react-vite";
 
import Button from "./button";
 
const meta = {
    // 👇 The component you're working on
    component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
// 👇 Type helper to reduce boilerplate 
type Story = StoryObj<typeof meta>;

// 👇 A story named Primary that renders `<Button primary label="Button" />`
export const Primary: Story = {
    args: {
        text: "Test Button",
        kind: "primary",
        id:"test-btn",
        type: "button",
        disabled: false,
        clickHandler: ()=> {}
    },
};

export const Secondary: Story = {
    args: {
        text: "Test Button",
        kind: "secondary",
        id:"test-btn",
        type: "button",
        disabled: false,
        clickHandler: ()=> {}
    },
};