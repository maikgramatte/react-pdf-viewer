/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import Spinner from '../components/Spinner';
import useIsMounted from '../hooks/useIsMounted';
import ThemeContext from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import { CharacterMap } from '../Viewer';
import AskForPasswordState from './AskForPasswordState';
import AskingPassword from './AskingPassword';
import CompletedState from './CompletedState';
import FailureState from './FailureState';
import LoadError from './LoadError';
import LoadingState from './LoadingState';
import LoadingStatus, { VerifyPassword } from './LoadingStatus';
import WrongPassword from './WrongPassword';
import WrongPasswordState from './WrongPasswordState';

export type RenderError = (error: LoadError) => React.ReactElement;

interface DocumentLoaderProps {
    characterMap?: CharacterMap;
    file: PdfJs.FileData;
    httpHeaders?: Record<string, string | string[]>;
    renderError?: RenderError;
    renderLoader?(percentages: number): React.ReactElement;
    render(doc: PdfJs.PdfDocument): React.ReactElement;
    withCredentials: boolean;
}

const DocumentLoader: React.FC<DocumentLoaderProps> = ({ characterMap, file, httpHeaders, render, renderError, renderLoader, withCredentials }) => {
    const theme = React.useContext(ThemeContext);
    const [status, setStatus] = React.useState<LoadingStatus>(new LoadingState(0));

    const [percentages, setPercentages] = React.useState(0);
    const [loadedDocument, setLoadedDocument] = React.useState<PdfJs.PdfDocument>(null);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        // If we don't reset the status when new `file` is provided
        // (for example, when opening file)
        // then we will see the error
        //  ```
        //  Invariant Violation: Rendered fewer hooks than expected.
        //  This may be caused by an accidental early return statement
        //  ```
        setStatus(new LoadingState(0));

        // Create a new worker
        const worker = new PdfJs.PDFWorker({ name: `PDFWorker_${Date.now()}` });

        const params: PdfJs.GetDocumentParams = Object.assign(
            {
                httpHeaders,
                withCredentials,
                worker,
            },
            ('string' === typeof file) ? { url: file } : { data: file },
            characterMap ? { cMapUrl: characterMap.url, cMapPacked: characterMap.isCompressed } : {}
        );

        const loadingTask = PdfJs.getDocument(params);
        loadingTask.onPassword = (verifyPassword: VerifyPassword, reason: string): void => {
            switch (reason) {
                case PdfJs.PasswordResponses.NEED_PASSWORD:
                    isMounted.current && setStatus(new AskForPasswordState(verifyPassword));
                    break;
                case PdfJs.PasswordResponses.INCORRECT_PASSWORD:
                    isMounted.current && setStatus(new WrongPasswordState(verifyPassword));
                    break;
                default:
                    break;
            }
        };
        loadingTask.onProgress = (progress) => {
            progress.total > 0
                // It seems weird but there is a case that `loaded` is greater than `total`
                ? isMounted.current && setPercentages(Math.min(100, 100 * progress.loaded / progress.total))
                : isMounted.current && setPercentages(100);
        };
        loadingTask.promise.then(
            (doc) => isMounted.current && setLoadedDocument(doc),
            (err) => isMounted.current && !worker.destroyed && setStatus(new FailureState({
                message: err.message || 'Cannot load document',
                name: err.name,
            })),
        );

        return (): void => {
            loadingTask.destroy();
            worker.destroy();
        };
    }, [file]);

    // There is a case that `loadingTask.promise()` is already resolved but `loadingTask.onProgress` is still triggered
    // (numOfPercentages does not reach 100 yet)
    // So, we have to check both `percentages` and `loaded`
    React.useEffect(() => {
        (percentages > 1 && loadedDocument)
            ? isMounted.current && setStatus(new CompletedState(loadedDocument))
            : isMounted.current && setStatus(new LoadingState(percentages));
    }, [percentages, loadedDocument]);

    switch (true) {
        case (status instanceof AskForPasswordState):
            return <AskingPassword verifyPasswordFn={(status as AskForPasswordState).verifyPasswordFn} />;
        case (status instanceof WrongPasswordState):
            return <WrongPassword verifyPasswordFn={(status as WrongPasswordState).verifyPasswordFn} />;
        case (status instanceof CompletedState):
            return render((status as CompletedState).doc);
        case (status instanceof FailureState):
            return renderError
                ? renderError((status as FailureState).error)
                : (
                    <div className={`${theme.prefixClass}-doc-error`}>
                        <div className={`${theme.prefixClass}-doc-error-text`}>
                            {(status as FailureState).error.message}
                        </div>
                    </div>
                );
        case (status instanceof LoadingState):
            return (
                <div className={`${theme.prefixClass}-doc-loading`}>
                    {
                        renderLoader ? renderLoader((status as LoadingState).percentages) : <Spinner />
                    }
                </div>
            );
        default:
            return (
                <div className={`${theme.prefixClass}-doc-loading`}>
                    <Spinner />
                </div>
            );
    }
};

export default DocumentLoader;
