export const originalGoogle = window.google; // Store original object

export const initializeGoogleMock = jest.fn().mockImplementation(()=> {
    requestAccessTokenMock();
})

export const requestAccessTokenMock = jest.fn().mockResolvedValue({ access_token: "mock_token" });

const getClientMock = jest.fn().mockReturnValue({
    requestAccessToken: requestAccessTokenMock
});

function renderButtonMock(buttonId) {
    return jest.fn().mockImplementation(()=> {
        const initializationArgs = initializeGoogleMock.mock.calls[0][0];
        const googleBtnMock = document.createElement("button");
        googleBtnMock.textContent = "This is my google button";
        googleBtnMock.setAttribute("data-testid", "google-test-btn");
        googleBtnMock.addEventListener("click", initializationArgs.callback);
        document.getElementById(buttonId).appendChild(googleBtnMock);
    });
}

export function getMockGoogleAccount(buttonId) {
    return {
        id: {
            initialize: initializeGoogleMock,
            getClient: getClientMock,
            renderButton: renderButtonMock(buttonId)
        }
    };
}

export const mockGoogleAccounts = {
    id: {
        initialize: initializeGoogleMock,
        getClient: getClientMock,
        renderButton: renderButtonMock("google_login_btn")
    }
};
