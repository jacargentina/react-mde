import * as React from 'react';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GetIcon, RefObj, SelectionRange, Tab, TextState } from '..';
import TextAreaTextApi from '../commands/TextAreaTextApi';
import enL18n from '../l18n/react-mde.en';
import SvgIcon from './SvgIcon';

type EventFilter = (
  e:
    | React.KeyboardEvent<HTMLTextAreaElement>
    | React.ClipboardEvent<HTMLTextAreaElement>
    | React.DragEvent<HTMLTextAreaElement>
    | React.ChangeEvent<HTMLInputElement>
) => boolean;

type EventRegistration = {
  filter: EventFilter;
  handler: Function;
};

export type ReactMdeContextData = {
  l18n: any;
  textarea: React.MutableRefObject<HTMLTextAreaElement>;
  preview: RefObj<HTMLDivElement>;
  selectedTab: Tab;
  setSelectedTab: Dispatch<SetStateAction<Tab>>;
  getIcon: GetIcon;
  getTextState: () => TextState;
  textApi: TextAreaTextApi;
  registerEventHandler: (reg: EventRegistration) => void;
  handlePossibleEvent: EventFilter;
  disableMaximize?: boolean;
  initialMaximized?: boolean;
  onMaximizedChange?: (isMaximized: boolean) => void;
  maximized: boolean;
  setMaximized: Dispatch<SetStateAction<boolean>>;
};

const ReactMdeContext = createContext<ReactMdeContextData | undefined>(
  undefined
);

export const ReactMdeProvider = (props: {
  children: any;
  onTabChange?: (tab: Tab) => void;
  getIcon?: GetIcon;
  disableMaximize?: boolean;
  initialMaximized?: boolean;
  onMaximizedChange?: (isMaximized: boolean) => void;
}) => {
  const {
    onTabChange,
    getIcon = (name) => <SvgIcon icon={name} />,
    disableMaximize,
    initialMaximized,
    onMaximizedChange,
    children,
  } = props;
  const textarea = useRef<null | HTMLTextAreaElement>(null);
  const eventHandlers = useRef<EventRegistration[]>([]);
  const getTextState = useCallback(() => {
    if (textarea.current == null) {
      const selection: SelectionRange = {
        start: 0,
        end: 0,
      };
      return {
        selection,
        text: '',
        selectedText: '',
      };
    }
    const selection: SelectionRange = {
      start: textarea.current?.selectionStart,
      end: textarea.current?.selectionEnd,
    };
    return {
      selection,
      text: textarea.current?.value,
      selectedText: textarea.current?.value.slice(
        textarea.current?.selectionStart,
        textarea.current?.selectionEnd
      ),
    };
  }, [textarea.current]);

  const registerEventHandler = useCallback((reg: EventRegistration) => {
    eventHandlers.current.push(reg);
  }, []);

  const handlePossibleEvent = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): boolean => {
    for (let i = 0; i < eventHandlers.current.length; i += 1) {
      const { filter, handler } = eventHandlers.current[i];
      if (filter(e)) {
        handler(e);
        return true;
      }
    }
    return false;
  };

  const textApi = useRef(new TextAreaTextApi(getTextState, textarea));
  const preview = useRef<null | HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState<Tab>('write');

  useEffect(() => {
    if (onTabChange) {
      onTabChange(selectedTab);
    }
  }, [selectedTab]);

  const [maximized, setMaximized] = useState(initialMaximized);

  const adjustTextareaHeight = () => {
    if (textarea.current && maximized) {
      textarea.current.style.height = 'auto';
    }
  };

  useEffect(() => {
    if (onMaximizedChange) {
      onMaximizedChange(maximized);
    }
    adjustTextareaHeight();
  }, [maximized, textarea]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [textarea]);

  return (
    <ReactMdeContext.Provider
      value={{
        l18n: enL18n,
        textApi: textApi.current,
        selectedTab,
        setSelectedTab,
        getIcon,
        preview,
        textarea,
        getTextState,
        registerEventHandler,
        handlePossibleEvent,
        disableMaximize,
        maximized,
        setMaximized,
      }}>
      {children}
    </ReactMdeContext.Provider>
  );
};

export const useReactMde = () => {
  const context = useContext(ReactMdeContext);
  if (!context) {
    throw new Error("useReactMde can't find a container ReactMdeProvider");
  }
  return context;
};

export default ReactMdeContext;
