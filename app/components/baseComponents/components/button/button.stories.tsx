import type { Meta, StoryObj } from "@storybook/react-vite";
 
import Button from "./button";
 
const meta = {
    component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
// 👇 Type helper to reduce boilerplate 
type Story = StoryObj<typeof meta>;

// 👇 A story named Primary that renders `<Button primary label="Button" />`
export const Primary: Story = {
    argTypes: {
        kind: {
            description: "Value can only be `primary` or `secondary`",
            control: "select",
            options: ["primary", "secondary"],
            table: {
                defaultValue: { 
                    summary: "primary"
                }
            }
        },
        disabled: {
            table: {
                defaultValue: { 
                    summary: "false"
                }
            }
        },
    },
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