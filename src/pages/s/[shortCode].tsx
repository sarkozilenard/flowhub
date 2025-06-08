import { GetServerSideProps } from 'next';
import prisma from '@/lib/prisma';

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
    // Find the short link
    const shortLink = await prisma.shortLink.findUnique({
      where: { shortCode },
      select: {
        originalUrl: true,
        clicks: true,
        id: true,
      }
    });

    if (!shortLink) {
      return {
        notFound: true,
      };
    }

    // Increment click count
    await prisma.shortLink.update({
      where: { shortCode },
      data: { clicks: shortLink.clicks + 1 }
    });

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