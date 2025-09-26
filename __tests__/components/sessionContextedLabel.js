import { render } from "@testing-library/react";
import SessionContextedLabel from "../../app/components/sessionContextedLabel.tsx";
import React from "react"
import { getLocalUserData } from "@/app/dataSources/localStorageShim"

jest.mock("../../app/dataSources/localStorageShim");

getLocalUserData.mockImplementation(() => {
    return { userName: null, googleuserId: null }
});

describe("SessionContextedLabel", () => {
    it("should render", () => {
        render(<SessionContextedLabel/>);
    });

    it("should call to setSessionInfo when sessionInfo.userName is null", () => {
        // Arrange
        const setSessionInfoMock = jest.fn();
        jest.spyOn(React, "useContext").mockReturnValue({ sessionInfo: { userName: null }, setSessionInfo: setSessionInfoMock });

        // Act
        render(<SessionContextedLabel/>);

        // Assert
        expect(setSessionInfoMock).toHaveBeenCalled();
    });

    it("should not call to setSessionInfo when sessionInfo.userName empty string", () => {
        // Arrange
        const setSessionInfoMock = jest.fn();
        jest.spyOn(React, "useContext").mockReturnValue({ sessionInfo: { userName: "" }, setSessionInfo: setSessionInfoMock });

        // Act
        render(<SessionContextedLabel/>);

        // Assert
        expect(setSessionInfoMock).not.toHaveBeenCalled();
    });

    it("should call to setSessionInfo when sessionInfo.googleUserId is null", () => {
        // Arrange
        const setSessionInfoMock = jest.fn();
        jest.spyOn(React, "useContext").mockReturnValue({ sessionInfo: { userName: "anything...", googleUserId: null }, setSessionInfo: setSessionInfoMock });

        // Act
        render(<SessionContextedLabel/>);

        // Assert
        expect(setSessionInfoMock).toHaveBeenCalled();
    });

    it("should not call to setSessionInfo when sessionInfo.googleUserId empty string", () => {
        // Arrange
        const setSessionInfoMock = jest.fn();
        jest.spyOn(React, "useContext").mockReturnValue({ sessionInfo: { userName: "anything...", googleUserId: "" }, setSessionInfo: setSessionInfoMock });

        // Act
        render(<SessionContextedLabel/>);

        // Assert
        expect(setSessionInfoMock).not.toHaveBeenCalled();
    });

    it("should not call to setSessionInfo with nulls even if localStore retuns nulls", () => {
        // Arrange
        const setSessionInfoMock = jest.fn();
        jest.spyOn(React, "useContext").mockReturnValue({ sessionInfo: { userName: null, googleUserId: null }, setSessionInfo: setSessionInfoMock });

        // Act
        render(<SessionContextedLabel/>);

        // Assert
        expect(setSessionInfoMock).toHaveBeenCalledWith({userName: "", googleUserId: ""});
    });
});
