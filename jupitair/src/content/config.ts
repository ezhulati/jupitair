import { defineCollection, z } from 'astro:content';

const cities = defineCollection({
  type: 'data',
  schema: z.object({
    cities: z.array(z.object({
      slug: z.string(),
      name: z.string(),
      fullName: z.string(),
      state: z.string(),
      zip: z.string(),
      county: z.string(),
      population: z.number(),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      description: z.string(),
      shortDescription: z.string(),
      serviceRadius: z.number(),
      priority: z.number(),
      established: z.boolean(),
      keywords: z.array(z.string()),
      demographics: z.object({
        medianIncome: z.number(),
        homeOwnership: z.number(),
        avgHomeAge: z.number(),
      }),
      marketData: z.object({
        competition: z.string(),
        opportunity: z.string(),
        searchVolume: z.number(),
      }),
    }))
  })
});

const services = defineCollection({
  type: 'data',
  schema: z.object({
    services: z.array(z.object({
      slug: z.string(),
      name: z.string(),
      title: z.string(),
      description: z.string(),
      shortDescription: z.string(),
      category: z.string(),
      priority: z.number(),
      emergency: z.boolean(),
      residential: z.boolean(),
      commercial: z.boolean(),
      keywords: z.array(z.string()),
      pricing: z.object({
        starting: z.number(),
        average: z.number(),
        description: z.string(),
      }),
      serviceTime: z.string(),
      warranty: z.string(),
    }))
  })
});

export const collections = {
  cities,
  services,
};