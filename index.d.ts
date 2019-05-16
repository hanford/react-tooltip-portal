declare module 'react-tooltip-portal' {
    import {CSSProperties, PureComponent} from 'react';

    type Positions = 'top' | 'left' | 'bottom' | 'right';

    export interface TooltipProps<E extends Element> {
        active: boolean;
        parent: E;
        children: React.ReactNode;
        offset?: number;
        position?: Positions;
        tipStyle?: CSSProperties;
        hoverEvents?: boolean;
        timeout?: number;
        className?: string;
    }

    class Tooltip<E extends Element> extends PureComponent<TooltipProps<E>> {}
    export default Tooltip;
}
