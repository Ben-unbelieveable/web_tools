import { link } from './helpers'

export const researchServiceLinks = [
  link({
    id: 'bioconda',
    name: 'Bioconda',
    url: 'https://bioconda.github.io/',
    description: 'Bioconda.org 生信软件包管理。',
    section: 'software',
    tags: ['bioinformatics'],
  }),
  link({
    id: 'cpan',
    name: 'CPAN',
    url: 'https://www.cpan.org/',
    description: 'Perl 综合典藏网络。',
    section: 'software',
    tags: ['perl'],
  }),
  link({
    id: 'galaxy-project',
    name: 'Galaxy Project',
    url: 'https://galaxyproject.org/',
    description: 'Galaxy Community Hub。',
    section: 'software',
    tags: ['galaxy'],
  }),
  link({
    id: 'r-project',
    name: 'R Project',
    url: 'https://www.r-project.org/',
    description: 'R 语言官方站点。',
    section: 'software',
    tags: ['r'],
  }),
  link({
    id: 'bioconductor',
    name: 'Bioconductor',
    url: 'https://www.bioconductor.org/',
    description: 'bioconductor.org 生信 R 包生态。',
    section: 'software',
    tags: ['r', 'bioinformatics'],
  }),
]
