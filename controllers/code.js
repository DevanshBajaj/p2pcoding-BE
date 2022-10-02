const fs = require('fs');
const { execSync } = require('child_process');
const codeHelper = require('../Helpers/codeHelper');
const Language = require("../enums/language")

const codeController = {
    runCode: async (req, res) => {
        console.log(req.body)
        let code = req.body.code;
        let input = req.body.input;
        let id = req.body.id;
        let lang = req.body.lang;

        const status = await codeController.runCodeInternal(code, input, id, lang);

        if (status.stderr) {
            res.status(400).json(status.stderr);
        } else {
            res.send(status.stdout);
        }
    },

    runCodeInternal: async (code, input, id, lang) => {
        let codeLanguage = Language.getLanguageByName(lang)
        // Extension of source code file
        const sourceExt = {
            'cpp': '.cpp',
            'java': '.java',
            'python': '.py',
        }
        // Compile and run command
        const command = {
            'cpp': `cd ${id} && g++ Main.cpp -o out && ./out < input.txt`,
            'java': `cd ${id} && javac Main.java && java Main < input.txt`,
            'python': `cd ${id} && python2 Main.py < input.txt`,
        }

        // Step 1: Make unique directory and 2 files inside directory and copy source code and input to it.
        codeHelper.createDir(id);
        codeHelper.createFile(`./${id}/Main`, codeLanguage.extension, code);
        codeHelper.createFile(`./${id}/input`, '.txt', input);

        // Step 2: Execute child process to generate output
        // exec opens a new terminal and executes the command
        try {
            const stdout = execSync(command[lang]);
            return {
                stdout: stdout.toString(),
                stderr: null
            }
        } catch (err) {
            return {
                stdout: null,
                stderr: err.stderr.toString()
            }
        } finally {
            codeHelper.removeDir(id);
        }
    }
}

module.exports = codeController;
