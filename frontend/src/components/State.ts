import { SinkProperties } from './Sink';
import App from '../App';
import { Connector } from '../connector';

class State {
    app: App

    constructor(app: App) {
        this.app = app;
    }

    eval(script: string) {
        let func = new Function('sinks', '{' + script + '}');
        let sinks: SinkProperties[] = [];

        let me = this;

        const defaultArgs = {
            x: 0,
            y: 0,
            w: 300,
            h: 300,
            type: 'line',
            sources: [],
        };

        (sinks as any).add = function (args: {
            x: string,
            y: string,
            w: string,
            h: string,
            type: string,
            sources: string[],
        }) {
            let assembledArgs = { ...defaultArgs, ...args };
            console.log(assembledArgs)
            this.push({
                size: {
                    x: assembledArgs.w,
                    y: assembledArgs.h,
                },
                position: {
                    x: assembledArgs.x,
                    y: assembledArgs.y,
                },
                connector: me.app.state.connector,
                type: assembledArgs.type,
                sources: assembledArgs.sources,
            });
            console.log(sinks)
        }

        try {
            func(sinks);
        } catch (e) {
            console.error(e);
        }
        this.app.setState({ sinks });
    }
}

export default State;