"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get SEO settings
router.get('/settings', async (req, res) => {
    try {
        const settings = await prisma.seoSettings.findFirst();
        res.json(settings || {
            metaTitle: 'EduAI Platform',
            metaDescription: 'Complete education management platform with AI integration',
            metaKeywords: 'education, AI, learning, school management',
            ogTitle: 'EduAI Platform',
            ogDescription: 'Next generation education management system',
            ogImage: '/images/og-image.jpg',
            twitterCard: 'summary_large_image',
            canonicalUrl: '',
            robotsTxt: 'User-agent: *\nAllow: /',
            sitemapEnabled: true
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch SEO settings' });
    }
});
// Update SEO settings
router.put('/settings', async (req, res) => {
    const { metaTitle, metaDescription, metaKeywords, ogTitle, ogDescription, ogImage, twitterCard, canonicalUrl, robotsTxt, sitemapEnabled } = req.body;
    try {
        const settings = await prisma.seoSettings.upsert({
            where: { id: 1 },
            update: {
                metaTitle,
                metaDescription,
                metaKeywords,
                ogTitle,
                ogDescription,
                ogImage,
                twitterCard,
                canonicalUrl,
                robotsTxt,
                sitemapEnabled
            },
            create: {
                metaTitle,
                metaDescription,
                metaKeywords,
                ogTitle,
                ogDescription,
                ogImage,
                twitterCard,
                canonicalUrl,
                robotsTxt,
                sitemapEnabled
            }
        });
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update SEO settings' });
    }
});
// Generate sitemap
router.get('/sitemap.xml', async (req, res) => {
    try {
        const baseUrl = req.get('host');
        const pages = [
            { url: '/', priority: '1.0', changefreq: 'daily' },
            { url: '/register', priority: '0.8', changefreq: 'monthly' },
            { url: '/login', priority: '0.8', changefreq: 'monthly' },
            { url: '/cbt-test', priority: '0.9', changefreq: 'weekly' },
            { url: '/analytics', priority: '0.7', changefreq: 'weekly' }
        ];
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
    <url>
      <loc>https://${baseUrl}${page.url}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
  `).join('')}
</urlset>`;
        res.set('Content-Type', 'application/xml');
        res.send(sitemap);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate sitemap' });
    }
});
exports.default = router;
