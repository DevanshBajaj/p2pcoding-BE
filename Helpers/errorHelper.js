const errorHelper = {
    badRequestError: (res, code, description) => {
        return res.status(400).json({errorCode: code, errorDescription: description})
    },
    unauthorizedError: (res, code, description) => {
        return res.status(401).json({errorCode: code, errorDescription: description})
    },
    internalServerError: (res, code, description) => {
        return res.status(500).json({errorCode: code, errorDescription: description})
    }
}

module.exports = errorHelper