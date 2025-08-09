import { render } from "@testing-library/react";
import LogoutButton from "../../../app/components/navigation/logoutButton.tsx";

describe("LogoutButton", () => {
    it("should render", () => {
        render(<LogoutButton/>);
    });
});
