import * as ejs from 'ejs';
import { readFileSync } from 'fs';
import { minify } from 'html-minifier';
import { join } from 'path';

interface ITemplatePaths {
    template: 'account-creation' | 'reset-password' | 'add-passenger';
}

export interface ITemplate {
    /**
     * Compile .ejs file, specified path and data
     *
     * @memberof ITemplate
     */
    compile: (template: ITemplatePaths, data?: any) => string;
}

const rootPath = join(__dirname, '..', '..', 'views', 'emails/');

const loadTemplate = {
    'account-creation': 'new-account.ejs',
    'reset-password': 'password-reset.ejs',
    'add-passenger': 'passenger.ejs',
};

export interface ICompileTemplate {
    /**
     * Compile .ejs file, specified path and data
     *
     * @memberof ITemplate
     */
    compileEjs: (template: ITemplatePaths, data?: any) => string;
}

export const compileEjs = (template: ITemplatePaths, data?: any) => {
    const text = readFileSync(rootPath + loadTemplate[template.template], 'utf-8');

    const html = ejs.compile(text)(data);

    return minify(html, { collapseWhitespace: true });
};
