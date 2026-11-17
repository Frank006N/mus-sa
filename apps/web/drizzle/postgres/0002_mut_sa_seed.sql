-- MUT community seed. Course names are based on the supplied brief; confirm current catalogue with MUT before launch.
INSERT INTO mut_sa_communities(type,name,slug,description,cover_image_url,icon_url) VALUES
('school','School of Computing & IT','school-computing-it','Academic community for computing and information technology students.','https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=256&q=80'),
('school','School of Business','school-business','Academic community for business students.','https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=256&q=80'),
('school','Student Clubs & Societies','student-clubs','Non-academic communities at Murang’a University of Technology.','https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=256&q=80')
ON CONFLICT(slug) DO NOTHING;

WITH course_data(school_slug,name,slug) AS (VALUES
('school-computing-it','Software Engineering','software-engineering'),
('school-computing-it','Information Technology','information-technology'),
('school-computing-it','Computer Science','computer-science'),
('school-business','Bachelor of Commerce','bachelor-of-commerce'),
('school-business','Procurement','procurement'),
('school-business','Hospitality','hospitality')
)
INSERT INTO mut_sa_communities(type,parent_id,name,slug,description,cover_image_url,icon_url)
SELECT 'course',s.id,c.name,c.slug,'Student community for '||c.name||' at Murang’a University of Technology.',
CASE WHEN c.school_slug='school-computing-it' THEN 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80' ELSE 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80' END,
'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=256&q=80'
FROM course_data c JOIN mut_sa_communities s ON s.slug=c.school_slug ON CONFLICT(slug) DO NOTHING;

INSERT INTO mut_sa_communities(type,parent_id,name,slug,description,cover_image_url,icon_url)
SELECT 'year_group',c.id,'Year '||y.year,'year-'||y.year||'-'||c.slug,'Year '||y.year||' community for '||c.name||'.',c.cover_image_url,c.icon_url
FROM mut_sa_communities c CROSS JOIN (VALUES(1),(2),(3),(4)) AS y(year) WHERE c.type='course'
ON CONFLICT(slug) DO NOTHING;

WITH clubs(name,slug,image) AS (VALUES
('Catholic Action','catholic-action','photo-1511632765486-a01980e01a18'),
('Christian Union','christian-union','photo-1529156069898-49953e39b3ac'),
('Scouts','scouts','photo-1478131143081-80f7f84ca84d'),
('Environmental Club','environmental-club','photo-1441974231531-c6227db76b6e')
)
INSERT INTO mut_sa_communities(type,parent_id,name,slug,description,cover_image_url,icon_url)
SELECT 'club',p.id,c.name,c.slug,c.name||' community at Murang’a University of Technology.',
'https://images.unsplash.com/'||c.image||'?auto=format&fit=crop&w=1600&q=80',
'https://images.unsplash.com/'||c.image||'?auto=format&fit=crop&w=256&q=80'
FROM clubs c JOIN mut_sa_communities p ON p.slug='student-clubs' ON CONFLICT(slug) DO NOTHING;
