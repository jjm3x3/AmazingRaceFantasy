export const originalGoogle = window.google; // Store original object

export const initializeGoogleMock = jest.fn();

export const requestAccessTokenMock = jest.fn().mockResolvedValue({ access_token: "mock_token" });

const getClientMock = jest.fn().mockReturnValue({
    requestAccessToken: requestAccessTokenMock,
});

const renderButtonMock = jest.fn().mockReturnValue(()=> {
    const initializationArgs = initializeGoogleMock.mock.calls[0][0];
    return <button data-testid="google-test-btn" onClick={initializationArgs.callback}>Google Btn</button>
})

export const mockGoogleAccounts = {
    id: {
        initialize: initializeGoogleMock,
        getClient: getClientMock,
        renderButton: renderButtonMock
    }
}