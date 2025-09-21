import { render, fireEvent } from "@testing-library/react";
import LogoutButton from "../../../app/components/navigation/logoutButton.tsx";
import React from "react"


describe("LogoutButton", () => {
    it("should render", () => {
        render(<LogoutButton/>);
    });

    it("should make an api call when it is clicked", () => {
        const fetchPromise = { then: jest.fn((resolve) => {
            resolve({/* http response */});
        })};
        window.fetch = jest.fn()
            .mockImplementation(() => fetchPromise);

        const { getByTestId } = render(<LogoutButton/>);
        const logoutButton = getByTestId("logout-button-core");
        fireEvent.click(logoutButton);
        expect(window.fetch).toHaveBeenCalled();
    });

    it("should resolve fetch response when it is clicked", () => {
        const fetchPromise = { then: jest.fn((resolve) => {
            resolve({/* http response */});
        })};
        window.fetch = jest.fn()
            .mockImplementation(() => fetchPromise);

        const { getByTestId } = render(<LogoutButton/>);
        const logoutButton = getByTestId("logout-button-core");
        fireEvent.click(logoutButton);
        expect(fetchPromise.then).toHaveBeenCalled()
    });

    it("should call set on sessionContext when a 205 is returned", () => {
        const fetchPromise = { then: jest.fn((resolve) => {
            resolve({status: 205});
        })};
        window.fetch = jest.fn()
            .mockImplementation(() => fetchPromise);
        const setIsLoggedInMock = jest.fn();
        jest.spyOn(React, "useContext").mockReturnValue({ setIsLoggedIn: setIsLoggedInMock });

        const { getByTestId } = render(
            <LogoutButton/>
        );
        const logoutButton = getByTestId("logout-button-core");
        fireEvent.click(logoutButton);

        expect(setIsLoggedInMock).toHaveBeenCalled();
    });
});
