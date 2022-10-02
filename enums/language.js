const Language = {
    CPP: {
        name: "cpp",
        extension: ".cpp"
    },
    JAVA: {
        name: "java",
        extension: ".java"
    },
    PYTHON2: {
        name: "python",
        extension: ".py"
    },
    getLanguageByName: (name) => {
        switch (name) {
            case "cpp":
                return Language.CPP
            case "java":
                return Language.JAVA
            case "python":
                return Language.PYTHON2
        }
    }
}
Object.freeze(Language)

module.exports = Language