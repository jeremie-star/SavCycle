import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const withGuest = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const [loading, setLoading] = useState(true);
    const [isNotAuthenticated, setIsNotAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        import('next/router').then(({ useRouter }) => {
          const router = useRouter();
          router.push('/dashboard');
        });
      } else {
        setIsNotAuthenticated(true);
        setLoading(false);
      }
    }, []);

    if (loading) return <p>You are already logged in</p>;

    return isNotAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withGuest;
