import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Dynamically import router to avoid SSR issues
        import('next/router').then(({ useRouter }) => {
          const router = useRouter();
          router.push('/auth');
        });
      } else {
        setIsAuthenticated(true);
        setLoading(false);
      }
    }, []);

    if (loading) return <p>You are not logged in</p>;

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withAuth;
