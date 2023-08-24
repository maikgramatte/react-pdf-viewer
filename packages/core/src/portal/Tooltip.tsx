/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import MuiTooltip, { TooltipProps as TooltipPropsMui, tooltipClasses  } from '@mui/material/Tooltip';

import { styled } from '@mui/material/styles';
import Offset from './Offset';
import Position from './Position';

const ThemedMuiTooltip = styled(({ className, ...props }: TooltipPropsMui) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        color: '#fff',
        fontSize: 14,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
  }));

type RenderTooltipContent = () => React.ReactNode;

type MuiPos = 'bottom-end'
| 'bottom-start'
| 'bottom'
| 'left-end'
| 'left-start'
| 'left'
| 'right-end'
| 'right-start'
| 'right'
| 'top-end'
| 'top-start'
| 'top';

interface TooltipProps {
    content: RenderTooltipContent;
    offset: Offset;
    position: Position;
    target: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ content, offset, position, target }) => {
    const targetRef = React.createRef<HTMLDivElement>();
    const targetLabel = React.createRef<HTMLSpanElement>();

    React.useEffect(() => {
        try {
            targetRef.current.querySelector('button').setAttribute('aria-label', targetLabel.current.innerText);
        } catch (error) {
            // ok.
        }
    }, []);

    const muiPosition = React.useMemo<MuiPos>(() => {
        return position.replace('_', '-')
                .toLowerCase()
                .replace('-center', '').
                replace('-left', "-start").
                replace('-right', '-end') as MuiPos;
    }, [position]);

    return (
        <ThemedMuiTooltip arrow placement={muiPosition} title={<>{content()}</>}>
            <div
                ref={targetRef}
            >
                {target}
                <span ref={targetLabel} className="label" style={{ display: 'none' }}>{content()}</span>
            </div>
        </ThemedMuiTooltip>
    );
};

export default Tooltip;
