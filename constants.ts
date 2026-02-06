import { Location, Tour, Booking } from './types';
import { Language } from './contexts/LanguageContext';

export const IMAGES = {
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAad22UwlinVT0BawJq_ctL6b0L7Xk9pPwYPuFO2yun_4G8Qm91ERdd3FEZWn-BiBZx9ytibdJKpGRqvN-8kpIuyzgv2hg72GaXa21UUbwZJzsEnrganJiJ6tJ5lC_JvDCr1hiW0rSGwnxdYSwlHJ8yRt5Hh1qoBxXI4IEwfkEpzjhovbVJBFlGvKay7QwbAXwIz01u23v4JWa-hHLtGPLK9gJ7qax-_Z4i4yn3qRFFkVFkcJQGN_aPG8e6YmXPee-gXhKY2yWuZo0',
  ouidah: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3BkXgR_L3ed9xOwrgBAV5m2Aitw7Tz0CHUWS05-rlFIBM77fPONvZ1hnSgBe48pjiv2_FTAxWEhv-muGaK70KexZZbW0uvKIrV8ljxJNFS7d3Xjp9FiR50pULWiMWaDp81W6Y7niaOoWUEUvgDGo4HP6eI5Kx3YHos-_ovXU8-qf0Pe8Sierr9ldc6PoDU_1vj4XK_z_RhqpDDNrwfd3w76Eku_UZaHeKxTsr_CJ8t_7UFR1OfFdsYh1yy3Ycplw0KlyelcCdXbQ',
  grandPopo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8hSUPvJecRMmZFFQwxj9CjWh2uxxGmTyLDq9xMGao2PEEeLBZsOM8dCVsGKIE7fxWNZou3VUvVA6dqbBO0mG_LFhOBA05AxRYXZBPa0VRDHBCx03RAaTy2nI4OEjFQwKTupmkqSC_ZaHOjz_cL5O88RUKijtxkgsJM8aM6xNSlSDGSvy-Rzb7XkzdnJzNSS7pJ401BL-Hn_Wq8Ms0bHOcptYPBFyItWmGipOj0e6fzm9Vx6JWt6en5XkLiGDxVbEpZX28Tow2J0',
  ganvie: 'https://benintourisme.bj/upload/thumbnails/banners//728410799111001708442794.jpg',
  amazone: 'https://benintourisme.bj/upload/thumbnails/banners//518600580030001708442568.jpg',
  murGraffe: 'https://benintourisme.bj/upload/thumbnails/banners//398760049759001708442607.jpg',
  routePeches: 'https://benintourisme.bj/upload/thumbnails/banners//271490396816001703041423.jpg',
  plageDorado: 'https://benintourisme.bj/upload/thumbnails/banners//795340395530001708442687.jpg',
  routeTata: 'https://benintourisme.bj/upload/thumbnails/banners//524600414734001716379105.jpg',
  palaces: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgFVzBhtc_W5MfJulzowEjdsYqH8v0L61XtoHTWxrV67Bej4KjrCF1QveYTup1Dut8rJzJgcwBhIrrmS60owscvkdPx5K38PeRLSHlJ3dximT3rfwkrSL9vM8NytlK0fEVFecpVkuRDEGrewmZR0Fn4PoaZ6kcvQ6Pu4e9iXanUV1HGnHanMvnAoZrWcC2pCC2eSr3ed1twnmuLriRp51SLMp3Vhq2kKst61x36siZMYOFCDf0O1Yn199MzNIVTD2LVTUJ4vDXP6Y',
  pendjari: 'https://benintourisme.bj/upload/thumbnails/banners//834760438538001728494098.jpg',
  food: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIMY-Pp1ZRMJ7H_ZNBAA6yYwFxvx05ML_IdaNQxB9cEb0x3qHl5K_zgL1tA17ix3Y0SN5AgrCRWKOTDnYfcQlJ1A_jpwWWgI-5x-PHn_ReeRc4F8JNLMZbcS-waoFMwROYc31fftDRx7G1K5qJZ5AmUNkNOZwCbdkPe_EhfFlukMDBNJvjU-2KvFLThQL-c3ZySOSnMPx5EE6_--xzQcLbyYVZiQ5c0BuMxv5JRF22k9kopOwfX0XbP1ZvZgHBea0PQE4qjNTgLx8',
  hotel: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdNuQ1Ex8GRtResErfS70HehwwNRA5fQ2isNuu3zWb0QuIpMPMjcEXEvfdeZ_zjrmK4inm-6zE3vJpqjIFnpjpDm_kERtk9cPfkNC07JYkiiNa2IGSGehcC-FjLsUJXcG6awkGPaJgrwwxo4roPXUsZDR4fdo4zEZfWcrIWW9sC18TxEH5OeeL7QFVDZmUoDxpyuRfGnpcW1tXkkXrYetwR2rRic3Rt7LF3fuSpud7ZqcnvQfdH8gh5GT5Zl7EoYI-fptQbf_psX8',
  map: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIfLRyZfUKQqYjr-ENudqD0nzAvWpzQYTh2SJHCY5TVjHSg_k9vG6Ki5Vhxh39grZz9UomeyubiKeLjMOEElW3sJabC_D5SvnsJv0_BU_Ks7jDJDt1WuGQaPEOwgVhUJlwFMjdhzqHR4dzFLTUq6CunnIyAFelAaTSzz43BAlODIO_nhQR7SKIWIaFGyjxSpPQxFVGK1V02BSlCv0oz2ibQo1yAd63-5Iabz67ozPySSikQPMrrasNMiNxB7W4wUOSnGLHoz6Z5D0',
  slaveRoute: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAQVYw5fjk0Y2Wb50LuzogsSN2u5aPlQ2_VYcgXxvUYx9uouCzESpSNH4w87SZauSz7Dgv4joD_nzX0NaHUm8mvG9QyjonXhBcrqSwQ83NPo2hTiyYKt2TYDktWwXVkfPh5BZ4BtdT9XcMNiN9J9IqplUmG6VN2Zzn29_bU8XLucPON_ZCn_TFbZT1gnPZrZKb3c4IKz9J56ayotJTu_oKz_Av_pO0uk8Tph8g_TsebZVV7lxh2EbPgYDiCoBU0xZoA1x8dyBkvZ8',
  voodoo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQEke-cVK4n7MweCUtc2Z-El6XyaDWC2a_IF4QEauQskyIFQqjUZSxbPvDM06OcSBZDn5sMpPQHtDKe3omv1dVAIT6xtJXsfhzS1yufoQbACkm5Q4SHadi_PVa69QFZ3F0FhKj6rZq7AzRFOIb4Fh4ZjWF330r9UF_ZF3unmn5PIRmH0geXIAUhAri56sq_KXSeJtLH7GNHxEYvoyNNN9TxBUKCmd18d57jcV1YGXqwb9UJpZvtmry-T6Am6Wd3LydaheW4csUvNk',
  pendjariSafari: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMjaI-4bdxtZ26wJ1hJQnD7IhGCIBLSuWLQrUhfnW9PFUn-GTf9pYnkIYsZ82hu7CLZ3VxNVkK-lgfPVCnRY-r0Sxcs6YFA6cNG_ysGKbMJsdBmDBqqZArT1Virl3fCRo8VV4rnXhPKDOHOdQZ9gHkfaVe2Ejdb2kEYXP8e6HZ8N2Jq8NyAUoyV8hSaXTQPem_vQTZFvMt7JwKo9nohgoBdj-ev-jxWjKelkKbFjz1seiU4baoU3TTxykocKX6TpqS46K45ftHhsM',
  ouidahMuseum: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVJNIhQiQ7rKCkXYVKQMqWI3Hj1WIrme6dqKMT7-uxYW6hvGN7Ncxlwx8xxPqb-wt9zBxyRVyBxAFRYuFsWfsI1xErkLer9J9OpvEaHhhAcI1d1C4D525mLMLVCOIZKpNu1j1OkL5ZAxG2jk0r5fPIPBH0B86vHU0WisYkQPk9QjATgy8BWdAYZdx2v7UuUNzHA96UQN8IHxPiS8dDkgSNsoGlmeDyUdS5DRuHfv_9tcKCSiUYwk9y5zDjoXwW0s0u0Gx113qgkXs',
  palaceDetail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2mw7lkILzKgHvVUKG37_4IfsDR4UGxuPIYYWfnZy_lEmrnN73hT4eHmLPFUibU63jovzesMrG1rc78mb5P8l3V1bbXEhrr_qJCxzUp4pkzzZKGYkKv7VpHAU5Z3tAmUFL7JrMl8QjKXPpsFBXndCQDRR_g1mOtmQDHNQh3YrdBc2Aub1IHtc-su5NesHs_ZkDorBkMUY4rYfCH4iTRcH3-RnKxAIOA9Pxoop98IdV_SBDGBROvk375BTllzdQp0nepethef7MfHU',
  palaceThumb1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkiNORfPjo5KNcqlp4DntBISjzW0hFXWFjOkh2HrHoPPjA6u_J-XLuAiZ25NaZbaHY6SAoLVHfWmA928JYQaSPVjPFSzlTwyosBfXKVJIpuQisxw_XLWz_xX8TYrQRIMSWGNwQq065s2f4m9w-p329PNN6rJZbXO4JBPV-fR8DhYlFVUwsRaY-btnD09kdDRUcnBsosdxqTeqSvNGVvGMor9G24MMgjRJadgtw52uR3VTaJNiD3CepfG7v2b9zv3fKIgc5jCyyWr8',
  palaceThumb2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNdGxYzhG_70mLv-k33z6A13c3Ad8k5aLoMYMX94Gk4u94Gy5SqzoJfVWNtsYK6uJcYkb_enb_RHzQkFYWRh8g41-wF24-Rmg92PVdiMEhZkMPPzSHO44Z6NR_zaypZ0bKSXKoNeiTCvGfn4V5_ZY5SUopE5LrgHP7UIi66L_M2-KYwpgVhLd3218QVBeVh3p6SeISShyjphWA04gWC_l-ZVpaKmR-cewqIISCBsu1NhG4bMfbmEWpa8xMNVay4uNkzAVdFYywcAc',
  palaceThumb3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDlH0NSH3nohygncZzwE8NxsZTA14iwUgcGXyjLM3mDszVQJoYu8ypiBcbkxhuFLv-R9z90uw1F0ZBy1D3-Aj8MTQU6nwH1c1iv35yzWVP6tGmF2rQzNxO7VEa6Etpaa76aBQHFT_NWuTkVrg2vVXBrpZwPbF2zvOqU8VDwOObRmhH1XZLM78D7eb17DyqHJLN-OwoDE2I-tAnqGcUCwUbevd6cI3QZwWC0AJz18ML_5mcQEpfFp2fvdHfsnFcg-jPZoefq2VZDY',
  lodgeDetail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8CWHRyz19twgOCPSy3p_zWA4nd-D73anO-SCDUh-_Z43r0Mm9fYz0WdjxL7qaRG67n73ZdwMsaQ6EziFmGYOGcSfX6ksFEJNwo-4fwB-eH9Es-cPpSRuu-78lWat9aMrdj5GCjs8VnD-W-W1WcZzOFCdTyKCNCfw5x4H_W-46SlYnlXSNUQGh1X03Uj4aVklxy1KL4qvgm-7K_3XQj9fh1buJCGMW3tvgJpg8TMtg0RHsGGmaUyTzW1isQ1nRSCgM5Qgr5N-GABI',
  lodgeThumb1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCyeVcYGjg7FmZ1AXtpam3iOQdeXxD7TJR5Q7WKLY1ahtPS3i0VpofcdULywyQ5d6D7ADpaqOwtH35tWmrcs7Xj20iL6xWf1qlcUAmsSGN5CB3AD0ghfDC64BAX0wh8XT6xmIXveeSUngtAPrqtCnS8v6Yve0i_JRCH_A9nYLuaVpkJc59U8P_NIMsUA7_yoZ579TZBCv3ppBMucdKCJ4iAqgg-N976ybpGS30pecdRqpL96wlmsRNBmzCFcoYvDjKm-ahSJ-vdeg',
  lodgeThumb2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1TfcfLR-WOy2zBxENIy_63kpO2mZCJVzZzT1FWir13kP5PhEXoVy-deGGebcUNK4x2Hp9TkcRmlz4qno5V5ZxcCuQ-RBpDIPke1aLzSjLJ0TJLxye56_nt0esIieOWPl740MnPZWZk2dYHP9_Jwubw1fmfiXC73xwDx0hVBP0UIC7SsftIqVZ6MzCd38teNPULnUgmd-AFPfjWUQs-V17KquhCYCJAnNMtJHSVtSFSg11vFAXLrO2Mh3bobzWVIQVNmnTC0uVoFo',
  lodgeThumb3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6MKQ5rZsN_wncaeMajs9UgbnYcY-ZHKH_ptDBpc1N4DmxTMc_yxN-FuP4mjg8k7TSJ8mKMi6PyDdIpRoz-6J38MRm5IieTMInMP7fy6GrOfV8ISixjUY6tffoOvxCvxKAPU2vF0E8IfA_3x84IRa5tT5bhCuMwNgPd8aj4Ui_tCZsXz_xduVH3AnrDyfD85bhoXC0L4VbZ-Y_1fJIpP80_Vl7xSKtj0Dz3to7ZRi1wl0cqUQlp03w7wvTZy4Aa_PXIezT37qKmZI',
  splash: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJfhK3f8SxLKbhuglRLgK-lbBw2XQiCQvpEzHqoaK2WhhiNCmHbf-7gf-AumpsIkgAu564RBNpGH2O4-WgAImMLj5gRaP3p6C1FMhws5OaFcTpkkmj6xrNrWNWyLGE0gygRBSRk4T403qLFm5gazduROzYLFbWr8lPf37rKoEEs687ag6lx66DPc8iP8oLY1ggMi4dVNVRhaK47pO9ujHBPZr6BU9wY4NJyRQ_3zH9-kE7zfc0mvew9RdUV_xSzPjCefGmT3Dz56w',
  user: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOBY6FXghveyq5UJl3HoSCybtrIymFEnr38U4Ggcla1Wl3ojijACEKT6r-2rM8NIaLMKwNxxTh1QxhxQn2XRteSgLl_Ea_RsYq21owkrjUUn0iCgeXyMrHbGA2j-D5tw0Zbpt9RBxI2p3W81-46_J93YqJw_DHiFHz6goaxNH-uLyO0cew7C5EiqsJj19emSUqMx1i_DNRfceDApYeDronpTc0VekkqTYP1K6ehcoBl1V3abKSwbxKaPlJvT9SIWtxWabj1fFoCkU',
  mapDetail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZrrWypY1u6AY6aUGak__7URGFCi3Qu3dCsOMx4bw-pmAVsZ7qXYKKJXAYF5B2wSrA2p_DvPDzid-1SoyiJOu0s5uwt0N83Uhu0-MrWsHspv7wGpdrJbpSMnC2mSw6MuIXD1RdQowRTjMGRrBYW7AB-yVGHwjbc_lj9BHvIKkRAM_g_F5wdMd7gfqKuK_HCJmYSeR7dwkE0optriCO_7p1oonkJqHCFkQ41y5MOKPPNBKl-kCVQRARqmFseLzzGUIDFMO_2Q0rEV4'
};

const DATA = {
  en: {
    featured: [
      {
        id: 'ouidah',
        name: 'Ouidah',
        subtitle: 'Cultural Capital & History',
        description: 'Discover the rich history of the Slave Route and the Python Temple.',
        rating: 4.8,
        reviews: 320,
        image: IMAGES.ouidah,
        category: 'Heritage',
      },
      {
        id: 'grand-popo',
        name: 'Grand-Popo',
        subtitle: 'Beach & Relaxation',
        description: 'Serene beaches and colonial architecture.',
        rating: 4.7,
        reviews: 210,
        image: IMAGES.grandPopo,
        category: 'Relaxation',
      },
      {
        id: 'ganvie',
        name: 'Ganvie',
        subtitle: 'The Venice of Africa',
        description: 'A wonderful lake city at the heart of Benin, a few kilometers from the economic capital, Cotonou. Discover Ganvie, a hidden treasure in West Africa.',
        rating: 4.6,
        reviews: 540,
        image: IMAGES.ganvie,
        category: 'Culture',
      },
      {
        id: 'amazone',
        name: 'The Amazone',
        subtitle: 'Cotonou',
        description: 'During a visit to Cotonou, the Amazone is a must-see. This emblematic statue embodies strength, dignity, and resilience, paying tribute to female heroism and Benin\'s history.',
        rating: 4.6,
        reviews: 0,
        image: IMAGES.amazone,
        category: 'Culture',
      },
      {
        id: 'mur-graffe',
        name: 'The Graffiti Wall',
        subtitle: 'Cotonou',
        description: 'An artistic jewel in the heart of Benin’s capital. Along this colorful wall, creativity bursts with audacity. Here, art meets urban life for an unforgettable visual and cultural experience.',
        rating: 4.6,
        reviews: 0,
        image: IMAGES.murGraffe,
        category: 'Culture',
      },
      {
        id: 'route-des-peches',
        name: 'Route des Pêches',
        subtitle: 'Atlantic Coast',
        description: 'Along the shimmering waters of the Gulf of Guinea stretches a panoramic road dotted with fishing villages and breathtaking coastal scenery.',
        rating: 4.6,
        reviews: 0,
        image: IMAGES.routePeches,
        category: 'Relaxation',
      },
      {
        id: 'plage-plm-el-dorado',
        name: 'PLM El Dorado Beach',
        subtitle: 'Cotonou',
        description: 'On Benin’s Atlantic coast, PLM El Dorado beach in Cotonou is more than a sandy shore: a haven for relaxation and entertainment.',
        rating: 4.6,
        reviews: 0,
        image: IMAGES.plageDorado,
        category: 'Relaxation',
      },
    ],
    heritage: [
      {
        id: 'royal-palaces',
        name: 'Royal Palaces',
        subtitle: 'Abomey',
        description: 'The Royal Palaces of Abomey are the major material testimony to the Kingdom of Dahomey which developed from the mid-17th century. Founded in 1625 by the Fon people, the kingdom became a powerful military and commercial empire.',
        rating: 4.8,
        reviews: 124,
        image: IMAGES.palaces,
        category: 'Heritage',
        price: '2,500 CFA',
        hours: '09:00 - 18:00',
        duration: '2 - 3 Hrs',
        images: [IMAGES.palaceDetail, IMAGES.palaceThumb1, IMAGES.palaceThumb2, IMAGES.palaceThumb3]
      },
      {
        id: 'pendjari',
        name: 'Pendjari National Park',
        subtitle: 'Atacora',
        description: 'With spectacular landscapes, abundant wildlife, and endless adventure opportunities, this national park is a top destination for nature lovers and travelers.',
        rating: 4.9,
        reviews: 89,
        image: IMAGES.pendjari,
        category: 'Nature',
      },
      {
        id: 'route-des-tata',
        name: 'Route des Tata',
        subtitle: 'Atacora',
        description: 'In the heart of Atacora, the Route des Tata and Koutammakou reveal themselves as unique treasures of Benin, listed as UNESCO World Heritage—places where history and culture meet a spectacular landscape.',
        rating: 4.6,
        reviews: 0,
        image: IMAGES.routeTata,
        category: 'Heritage',
      }
    ],
    nearby: [
      {
        id: 'chez-maman',
        name: 'Chez Maman Benin',
        subtitle: 'Authentic Local Cuisine',
        description: 'Fine local cuisine.',
        rating: 4.9,
        reviews: 120,
        image: IMAGES.food,
        category: 'Food',
        distance: '0.5 km',
        price: '$$'
      },
      {
        id: 'tata-somba',
        name: 'Hotel Tata Somba',
        subtitle: 'Luxury Accommodation',
        description: 'Modern luxury with traditional architecture.',
        rating: 4.5,
        reviews: 85,
        image: IMAGES.hotel,
        category: 'Hotel',
        distance: '1.2 km',
        price: '$$$'
      }
    ],
    tours: [
      {
        id: 'slave-route',
        name: 'The Slave Route',
        location: 'Ouidah, Benin',
        rating: 4.9,
        duration: '3.5 Hours',
        distance: '4 km Walk',
        stops: 5,
        price: 45,
        image: IMAGES.slaveRoute,
        tags: ['Heritage'],
        description: 'Walk the historic path in Ouidah, visiting the Museum and the poignant Tree of Forgetfulness.',
        stopNames: ['Ouidah Museum', 'Tree of Forgetfulness']
      },
      {
        id: 'voodoo-trail',
        name: 'Voodoo Culture Trail',
        location: 'Allada, Benin',
        rating: 4.8,
        duration: 'Full Day',
        distance: 'Small Group',
        stops: 6,
        price: 60,
        image: IMAGES.voodoo,
        tags: ['Cultural'],
        description: 'Experience the Temple of Pythons and witness authentic Egungun masquerades.',
        stopNames: ['Temple of Pythons', 'Sacred Forest']
      },
      {
        id: 'pendjari-safari',
        name: 'Pendjari Safari',
        location: 'Atakora, Benin',
        rating: 5.0,
        duration: '2 Days',
        distance: '4x4 Included',
        stops: 0,
        price: 150,
        image: IMAGES.pendjariSafari,
        tags: ['Nature'],
        description: 'Immersive wildlife experience spotting elephants, lions, and hippos in their natural habitat.',
        stopNames: ['Pendjari River', 'Eco-Lodge']
      }
    ],
    bookings: [
      {
        id: 'b1',
        title: 'History of Ouidah Circuit',
        date: 'Oct 12, 2023',
        time: '10:00 AM',
        guests: '2 Adults',
        status: 'Confirmed',
        image: IMAGES.ouidahMuseum
      },
      {
        id: 'b2',
        title: 'Pendjari Safari Day Trip',
        date: 'Nov 05, 2023',
        time: '06:00 AM',
        guests: '1 Adult',
        status: 'Pending',
        image: IMAGES.pendjariSafari
      }
    ]
  },
  fr: {
    featured: [
      {
        id: 'ouidah',
        name: 'Ouidah',
        subtitle: 'Capitale Culturelle & Histoire',
        description: 'Découvrez la riche histoire de la Route des Esclaves et le Temple des Pythons.',
        rating: 4.8,
        reviews: 320,
        image: IMAGES.ouidah,
        category: 'Heritage',
      },
      {
        id: 'grand-popo',
        name: 'Grand-Popo',
        subtitle: 'Plage & Détente',
        description: 'Plages sereines et architecture coloniale.',
        rating: 4.7,
        reviews: 210,
        image: IMAGES.grandPopo,
        category: 'Relaxation',
      },
      {
        id: 'ganvie',
        name: 'Ganvié',
        subtitle: 'La Venise de l\'Afrique',
        description: 'Merveilleuse ville lacustre située au cœur du Bénin, à quelques kilomètres de la capitale économique, Cotonou. Découvrez Ganvié, un trésor caché au cœur de l\'Afrique occidentale.',
        rating: 4.6,
        reviews: 540,
        image: IMAGES.ganvie,
        category: 'Culture',
      },
      {
        id: 'amazone',
        name: 'L’Amazone',
        subtitle: 'Cotonou',
        description: 'Lors d\'une visite à Cotonou, l\'Amazone est une étape incontournable. Cette statue emblématique incarne la force, la dignité et la résilience. Elle représente un hommage vibrant à l\'héroïsme féminin et à la richesse de l\'histoire béninoise.',
        rating: 4.6,
        reviews: 0,
        image: IMAGES.amazone,
        category: 'Culture',
      },
      {
        id: 'mur-graffe',
        name: 'Le mur graffé',
        subtitle: 'Cotonou',
        description: 'Un joyau artistique s\'épanouit au cœur de la capitale béninoise. Le long de ce mur coloré, une créativité débordante s\'exprime avec audace. Ici, l\'art rencontre l\'urbanité pour offrir aux passants une expérience visuelle et culturelle inoubliable.',
        rating: 4.6,
        reviews: 0,
        image: IMAGES.murGraffe,
        category: 'Culture',
      },
      {
        id: 'route-des-peches',
        name: 'La route des pêches',
        subtitle: 'Littoral Atlantique',
        description: 'Au bord des eaux scintillantes du golfe de Guinée, s\'étend une route panoramique parsemée de villages de pêcheurs pittoresques et de paysages côtiers à couper le souffle : bienvenue sur la Route des Pêches !',
        rating: 4.6,
        reviews: 0,
        image: IMAGES.routePeches,
        category: 'Relaxation',
      },
      {
        id: 'plage-plm-el-dorado',
        name: 'Plage PLM El Dorado',
        subtitle: 'Cotonou',
        description: 'Située sur la côte atlantique du Bénin, la plage PLM El Dorado à Cotonou est bien plus qu\'un simple littoral de sable : c\'est un havre de paix et de divertissement où les visiteurs peuvent se détendre, se ressourcer et se divertir.',
        rating: 4.6,
        reviews: 0,
        image: IMAGES.plageDorado,
        category: 'Relaxation',
      },
    ],
    heritage: [
      {
        id: 'royal-palaces',
        name: 'Palais Royaux',
        subtitle: 'Abomey',
        description: 'Les Palais Royaux d\'Abomey sont le témoignage matériel majeur du Royaume de Dahomey qui s\'est développé à partir du milieu du 17ème siècle. Fondé en 1625 par le peuple Fon, le royaume est devenu un puissant empire militaire et commercial.',
        rating: 4.8,
        reviews: 124,
        image: IMAGES.palaces,
        category: 'Heritage',
        price: '2,500 CFA',
        hours: '09:00 - 18:00',
        duration: '2 - 3 Hrs',
        images: [IMAGES.palaceDetail, IMAGES.palaceThumb1, IMAGES.palaceThumb2, IMAGES.palaceThumb3]
      },
      {
        id: 'pendjari',
        name: 'Parc de la Pendjari',
        subtitle: 'Atacora',
        description: 'Avec ses paysages spectaculaires, sa faune sauvage abondante et ses opportunités d\'aventure sans fin, ce parc national est une destination de choix pour les amoureux de la nature et les passionnés de voyage.',
        rating: 4.9,
        reviews: 89,
        image: IMAGES.pendjari,
        category: 'Nature',
      },
      {
        id: 'route-des-tata',
        name: 'La route des Tata',
        subtitle: 'Atacora',
        description: 'Au cœur de l\'Atacora, la Route des Tata et le Koutammakou se dévoilent comme des trésors uniques du Bénin, inscrits au patrimoine mondial de l\'UNESCO. Lieux où l\'histoire et la culture se rencontrent dans un paysage spectaculaire.',
        rating: 4.6,
        reviews: 0,
        image: IMAGES.routeTata,
        category: 'Heritage',
      }
    ],
    nearby: [
      {
        id: 'chez-maman',
        name: 'Chez Maman Benin',
        subtitle: 'Cuisine locale authentique',
        description: 'Cuisine locale raffinée.',
        rating: 4.9,
        reviews: 120,
        image: IMAGES.food,
        category: 'Food',
        distance: '0.5 km',
        price: '$$'
      },
      {
        id: 'tata-somba',
        name: 'Hôtel Tata Somba',
        subtitle: 'Hébergement de luxe',
        description: 'Luxe moderne avec architecture traditionnelle.',
        rating: 4.5,
        reviews: 85,
        image: IMAGES.hotel,
        category: 'Hotel',
        distance: '1.2 km',
        price: '$$$'
      }
    ],
    tours: [
      {
        id: 'slave-route',
        name: 'La Route des Esclaves',
        location: 'Ouidah, Bénin',
        rating: 4.9,
        duration: '3.5 Heures',
        distance: '4 km Marche',
        stops: 5,
        price: 45,
        image: IMAGES.slaveRoute,
        tags: ['Heritage'],
        description: 'Parcourez le chemin historique à Ouidah, en visitant le musée et l\'arbre de l\'oubli poignant.',
        stopNames: ['Musée Ouidah', 'Arbre de l\'oubli']
      },
      {
        id: 'voodoo-trail',
        name: 'Sentier Culturel Vaudou',
        location: 'Allada, Bénin',
        rating: 4.8,
        duration: 'Journée',
        distance: 'Petit Groupe',
        stops: 6,
        price: 60,
        image: IMAGES.voodoo,
        tags: ['Cultural'],
        description: 'Découvrez le Temple des Pythons et assistez à d\'authentiques mascarades Egungun.',
        stopNames: ['Temple des Pythons', 'Forêt Sacrée']
      },
      {
        id: 'pendjari-safari',
        name: 'Safari Pendjari',
        location: 'Atakora, Bénin',
        rating: 5.0,
        duration: '2 Jours',
        distance: '4x4 Inclus',
        stops: 0,
        price: 150,
        image: IMAGES.pendjariSafari,
        tags: ['Nature'],
        description: 'Expérience immersive de la faune, observation d\'éléphants, lions et hippopotames dans leur habitat naturel.',
        stopNames: ['Rivière Pendjari', 'Éco-Lodge']
      }
    ],
    bookings: [
      {
        id: 'b1',
        title: 'Circuit Histoire de Ouidah',
        date: '12 Oct 2023',
        time: '10:00',
        guests: '2 Adultes',
        status: 'Confirmed',
        image: IMAGES.ouidahMuseum
      },
      {
        id: 'b2',
        title: 'Excursion Safari Pendjari',
        date: '05 Nov 2023',
        time: '06:00',
        guests: '1 Adulte',
        status: 'Pending',
        image: IMAGES.pendjariSafari
      }
    ]
  }
} as const;

export const getFeaturedDestinations = (lang: Language) => DATA[lang].featured;
export const getHeritageSites = (lang: Language) => DATA[lang].heritage;
export const getNearbyActivities = (lang: Language) => DATA[lang].nearby;
export const getTours = (lang: Language) => DATA[lang].tours;
export const getBookings = (lang: Language) => DATA[lang].bookings;
