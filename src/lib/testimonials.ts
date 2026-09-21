export interface Testimonial {
  name: string;
  role: string;
  portrait: string;
  quote: string;
  videoSrc?: string;
  posterSrc?: string;
  caseStudyHref?: string;
  caseStudyLabel?: string;
}

export const testimonials: readonly Testimonial[] = [
  {
    name: 'Alyssa Wong',
    role: 'Director of Growth Marketing at Slice',
    portrait: '/images/alyssa-wong.webp',
    quote: '“Partnering with Upsight has been transformational for Slice. They quickly identified tracking gaps, streamlined our data infrastructure, and implemented server-side tracking and compliance, giving us cleaner data, better visibility, and confidence in our analytics.”',
    videoSrc: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663269151870/NKnKdFDxhaRVudBQKnGMGB/AlyssaWong-SliceLife_76a30443.mp4',
    posterSrc: '/images/testimonials/alyssa-wong-testimonial-poster.png',
    caseStudyHref: '/case-studies/slice/',
    caseStudyLabel: 'Read Slice Case Study',
  },
  {
    name: 'Alan Waggoner',
    role: 'Paid Media Manager at Shift',
    portrait: '/images/alan-waggoner.webp',
    quote: '“Upsight Digital is simply amazing. Their team solves tracking and analytics challenges that no one else can. Fast, reliable, and brilliant. Working with them has made me look like a rock star for years.”',
    videoSrc: '/videos/testimonials/alan-waggoner-testimonial.mp4',
    posterSrc: '/images/testimonials/alan-waggoner-testimonial-poster.png',
  },
  {
    name: 'Ashley Stanford',
    role: 'Head of Marketing at TicketSocket',
    portrait: '/images/ashley-stanford.webp',
    quote: '“Upsight Digital has been an incredible resource for our team. They support our devs with Google Suite, Analytics, and e-commerce tracking—always prompt, thorough, and extremely helpful. We continue to work with them and gladly refer them to others.”',
    videoSrc: '/videos/testimonials/ashley-stanford-testimonial.mp4',
    posterSrc: '/images/testimonials/ashley-stanford-testimonial-poster.png',
  },
];
