class Server {
    async startServer() {
        const colors = require('colors');
        const path = require('path');
        const express = require('express');
        const {
            displayHeader,
            accinfo,
            login,
            ptcAds,
            spin
        } = require('./src/index');
        require('dotenv').config();

        // 🔑 Multi-account setup
        const usernames = [
            'leiamnash',
            'mynameishi',
            'mynameishello'
        ];
        const password = 'Leiamnash0616';

        const port = process.env.PORT || 3000;

        colors.setTheme({
            silly: 'rainbow',
            input: 'grey',
            verbose: 'cyan',
            prompt: 'grey',
            info: 'green',
            data: 'grey',
            help: 'cyan',
            warn: 'yellow',
            debug: 'blue',
            error: 'red'
        });

        const app = express();

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // ✅ Run tasks for a single account
        async function runTasksForUser(username) {
            try {
                console.log(colors.verbose.bold(`[ ACCOUNT ] `) + colors.info(`Running for ${username}`));
                let cookies = await login(username, password);
                let resp = await spin(cookies);
                if (typeof resp.message === 'undefined') throw new Error("Please wait until the timer runs out and try again later.");
                console.log(colors.info.bold("[ SPIN ] ") + colors.info(resp.message));
                await accinfo(cookies, true);
            }
            catch (e) {
                console.log(colors.warn.bold("[ SCRIPT ] ") + colors.error(e.toString()));
                console.log(colors.warn.bold("[ SCRIPT ] ") + colors.warn(`Reconnecting for ${username}...`));
                await delay(60000);
                await runTasksForUser(username);
            }
        }

        // ✅ Run tasks for all accounts every 10 minutes
        async function runEveryTenMinutes() {
            while (true) {
                for (const username of usernames) {
                    await runTasksForUser(username);
                    await delay(5000); // small delay between accounts (avoid rate limit)
                }
                await delay(600000); // 10 minutes
            }
        }

        async function runPtcViewerForUser(username) {
            while (true) {
                let cookies = await login(username, password);
                let res1 = await ptcAds(cookies);
                console.log(colors.info.bold(`[ PTC ADS ] (${username}) `) + colors.info(res1));
                await accinfo(cookies, true);
                await delay(5000);
            }
        }

        app.get('/', (req, res) => {
            res.send('SERVER FOR BITBON FAUCET - AUTO FARM SCRIPT\nMADE\nBY\nHackMeSenpai(HMS)')
        });

        app.listen(port, async () => {
            displayHeader();
            console.log(colors.verbose.bold("[ SERVER ]") + colors.info(` Server port ${port} exposed!`));
            for (const username of usernames) {
                let cookies = await login(username, password);
                await accinfo(cookies);
            }
            runEveryTenMinutes();
            /*
            CURRENTLY THIS FUNC. IS DISABLED DUE TO API PROBLEMS
            for (const username of usernames) runPtcViewerForUser(username);
            */
        });
    }
}

module.exports = new Server();
