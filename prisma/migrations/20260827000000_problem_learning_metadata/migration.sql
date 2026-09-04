ALTER TABLE "Problem" ADD COLUMN "commonMistakes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], ADD COLUMN "guidanceHints" JSONB NOT NULL DEFAULT '[]'::jsonb;
