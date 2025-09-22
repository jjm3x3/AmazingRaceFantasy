import { render } from "@testing-library/react";
import SessionContextedLabel from "../../app/components/sessionContextedLabel.tsx";
import React from "react"


describe("SessionContextedLabel", () => {
    it("should render", () => {
        render(<SessionContextedLabel/>);
    });
});
