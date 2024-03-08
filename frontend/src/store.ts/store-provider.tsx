import { ReactNode, createContext, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import AuthStore from './auth-store';

interface IStore {
  authStore: AuthStore;
}

const store = {
  authStore: new AuthStore(),
};

const Context = createContext<IStore>(store);

type Props = {
  children: ReactNode;
};

export const useAppStore = () => {
  const store = useContext(Context);
  if (!store) throw new Error('Use App store within provider!');
  return store;
};

export const AppStoreProvider = observer(({ children }: Props) => {
  return <Context.Provider value={store}>{children}</Context.Provider>;
});
