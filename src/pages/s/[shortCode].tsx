import { GetServerSideProps } from 'next';
import { createClient } from '@/util/supabase/api';

export default function ShortLinkRedirect() {
  // This component will never render as we redirect on the server side
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { shortCode } = context.params!;

  if (!shortCode || typeof shortCode !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const supabase = createClient();

    // Find the short link
    const { data: shortLink, error } = await supabase
      .from('ShortLink')
      .select('originalUrl, clicks')
      .eq('shortCode', shortCode)
      .single();

    if (error || !shortLink) {
      return {
        notFound: true,
      };
    }

    // Increment click count
    await supabase
      .from('ShortLink')
      .update({ clicks: shortLink.clicks + 1 })
      .eq('shortCode', shortCode);

    // Redirect to original URL
    return {
      redirect: {
        destination: shortLink.originalUrl,
        permanent: false,
      },
    };
  } catch (error) {
    console.error('Error redirecting short link:', error);
    return {
      notFound: true,
    };
  }
};