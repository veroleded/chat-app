import AsideContainer from '../../AsideContainer/AsideContainer';
import { useAppStore } from '../../../store.ts/store-provider';
import ProfileInner from './ProfileInner';
import { User } from '../../../models/User';

const Profile = () => {
  const {
    authStore: { user },
  } = useAppStore();

  return (
    <AsideContainer headerName='Профиль'>
      <div className='flex flex-col px-3 pt-3'>
        <ProfileInner user={user as User} />
      </div>
    </AsideContainer>
  );
};

export default Profile;
