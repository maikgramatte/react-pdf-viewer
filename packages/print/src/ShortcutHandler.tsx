/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import PrintStatus from './PrintStatus';
import StoreProps from './StoreProps';

interface ShortcutHandlerProps {
    containerRef: React.RefObject<HTMLDivElement>
    store: Store<StoreProps>;
}

const ShortcutHandler: React.FC<ShortcutHandlerProps> = ({ containerRef, store }) => {
    const keydownHandler = (e: KeyboardEvent) => {
        if (e.key !== 'p' || !e.metaKey || e.ctrlKey) {
            return;
        }

        const containerEle = containerRef.current;
        if (!containerEle || !document.activeElement || !document.activeElement.contains(containerEle)) {
            return;
        }

        e.preventDefault();
        store.update('printStatus', PrintStatus.Preparing);
    };

    React.useEffect(() => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }

        document.addEventListener('keydown', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
        };
    }, [containerRef.current]);

    return (<></>);
};

export default ShortcutHandler;
 