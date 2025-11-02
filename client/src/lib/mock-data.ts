export type MediaAsset = {
  id: string;
  name: string;
  type: 'Image' | 'Video' | 'Audio';
  size: string;
  project: string;
  lastModified: string;
  imageUrl: string;
  isAiGenerated: boolean;
  dimensions?: string;
  isSelected: boolean;
};

export const mockMediaAssets: MediaAsset[] = [
  {
    id: '1',
    name: 'AI_Sunset_Concept.jpg',
    type: 'Image',
    size: '2.1 MB',
    project: 'Campaign Alpha',
    lastModified: '2023-11-20',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNQ5ZlZX66j6H09n2uWXkBLDwlmNJ8F6PXbMxg62njuRkL9EjuFelBiqe5nlAg3oriZXuPy0-QgYwFPoHPwPzphhckaxKzGZsGob808abZlogDE6UJ10aFieLKEOyF1RYJgvvrzjdgft8gcel56d3VDymzNyL-JUcbpgUqof1pexqzYhNzHRfJnbRcbQPBxbecdNs96pb6alZck3hzC3ix6vNffVKO5OJx46t1a1qiDpjok7VBIKaAvqm5Pj8M4NMWyQVEm4zzKIc',
    isAiGenerated: true,
    dimensions: '1920x1080',
    isSelected: true,
  },
  {
    id: '2',
    name: 'Future_Cityscape.png',
    type: 'Image',
    size: '5.8 MB',
    project: 'Urban Renewal',
    lastModified: '2023-11-28',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB46UkXOvwssA4pJulylhj0Cc_TSrcw9OqKMbxtO4Gy9DaGTepDvkaeK9ltLvqcWxuGzYwe7CWVebhJ-a1uE6J0gcNON75AGuaTikkKMB8b-OffHsRP5RxqUllY0TQqILTOJcHyFlINBzOY-Ep86ojxZ64IaRV6q8LmsFxUMLlyUUFRo2e_tdxeEGMUdSFdwJl-ADTc2rsqZa3gT4MpBWEYc5whiJ4Itrb0WjDcgTRKFDhdGj2-58nk-Uuv9i-iZ1-CLMFaMFr5LjqQ',
    isAiGenerated: true,
    isSelected: false,
  },
  {
    id: '3',
    name: 'Ocean_Waves_Loop.mp4',
    type: 'Video',
    size: '15.2 MB',
    project: 'Aqua Ads',
    lastModified: '2023-11-15',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRLOVHxtWp-k2ZwCQxp3Sk-einG3wS0GewRQp7D95w4ZsPPaLCxpwxJEj1XyOg9v2cgrygGeUQcAT8CEclO1EknVR8hj_0K1poKcIftLWwAqeVVvdMC5Lt2-HHumYuAAdoYgXfbeP4r0nfVncQbEtBFNghA9WbzdYZ61sW25XurrhZFdDs_YNJsoDJitUKmzdaciwis939AJ8-P1L8Tgmgta0fcRH_Kc2ogyJZSk1KzQn2R4SSfFmc4G30MAkqgzMFdn9cUkEgnGc',
    isAiGenerated: false,
    isSelected: false,
  },
  {
    id: '4',
    name: 'Floral_Detail.jpg',
    type: 'Image',
    size: '890 KB',
    project: 'Garden Beauty',
    lastModified: '2023-10-25',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK55qBnKucKbqZ7ivzww1MdeXeTIh8H8_4AdNdGphDbgpzXFSvKDjhiW3_hhWpxw35cRws812l8pI37z7glpo1g_RN4heA7Pew1dD6NdMuQONGZfpo6iEKF6PFdEHezbNPQM2Y_MAPme3Knwr626zfNIIgfwk5lw8HEbfE1u6JZPzhJI5L29Qy1BIEevrMQFBgwINh7OzHW--deqQzht3IWNSw0Qv7SYsh1_HgQwuL__kJCtQfVqUeQsCWAXZhU-BMHivmrlYIU7I',
    isAiGenerated: false,
    isSelected: false,
  },
  {
    id: '5',
    name: 'Uplifting_Corporate.mp3',
    type: 'Audio',
    size: '3.5 MB',
    project: 'Q4 Presentation',
    lastModified: '2023-12-01',
    imageUrl: '', // No image for audio
    isAiGenerated: false,
    isSelected: false,
  },
  {
    id: '6',
    name: 'Dream_World_Concept.jpg',
    type: 'Image',
    size: '4.2 MB',
    project: 'Fantasy Game',
    lastModified: '2023-11-01',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc2SguBGo0k71nhB11fHKZ6nTrB2CYG7tgHkEnGuc_axwrjIKukRacIpFbTbjTBLtB4z0CmxgGGou4J7sTvw7DQue36FG2REnvDontC1huAl-deDJq-RRQUGC60_dSSsCZR9oU3RRgJzdBMgOYu_wxv4CNJpa1jTBdjFSGaz1IjbOemwEafu7EZOcsuJx_ku__Ur35Gc5uNLd_6BBXJB5aqPrG9iGG9Wq8XrSI24x2Pzvn5Si6SAZl9C8AwRSjsggrR-HPXNYfA4E',
    isAiGenerated: true,
    isSelected: false,
  },
];
