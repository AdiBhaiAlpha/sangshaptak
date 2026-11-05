export interface DivisionInfo {
  id: string;
  name: string;
  districts: {
    id: string;
    name: string;
    upazilas: string[];
  }[];
}

export const bangladeshDivisions: DivisionInfo[] = [
  {
    id: 'dhaka',
    name: 'ঢাকা',
    districts: [
      {
        id: 'dhaka-dist',
        name: 'ঢাকা',
        upazilas: ['ধানমন্ডি', 'মিরপুর', 'গুলশান', 'উত্তরা', 'মতিঝিল', 'সাভার', 'ধামরাই', 'কেরানীগঞ্জ'],
      },
      {
        id: 'gazipur',
        name: 'গাজীপুর',
        upazilas: ['গাজীপুর সদর', 'টঙ্গী', 'কালিয়াকৈর', 'শ্রীপুর', 'কাপাসিয়া'],
      },
      {
        id: 'narayanganj',
        name: 'নারায়ণগঞ্জ',
        upazilas: ['নারায়ণগঞ্জ সদর', 'সোনারগাঁ', 'রূপগঞ্জ', 'আড়াইহাজার', 'সিদ্ধিরগঞ্জ'],
      },
      {
        id: 'narsingdi',
        name: 'নরসিংদী',
        upazilas: ['নরসিংদী সদর', 'পলাশ', 'শিবপুর', 'রায়পুরা', 'মনোহরদী'],
      },
      {
        id: 'tangail',
        name: 'টাঙ্গাইল',
        upazilas: ['টাঙ্গাইল সদর', 'মির্জাপুর', 'কালিহাতী', 'মধুপুর', 'ঘাটাইল'],
      },
    ],
  },
  {
    id: 'chittagong',
    name: 'চট্টগ্রাম',
    districts: [
      {
        id: 'ctg-dist',
        name: 'চট্টগ্রাম',
        upazilas: ['কোতোয়ালী', 'পাঁচলাইশ', 'পতেঙ্গা', 'সীতাকুণ্ড', 'মিরসরাই', 'রাঙ্গুনিয়া', 'ফটিকছড়ি'],
      },
      {
        id: 'coxsbazar',
        name: 'কক্সবাজার',
        upazilas: ['কক্সবাজার সদর', 'টেকনাফ', 'উখিয়া', 'রামু', 'মহেশখালী', 'চকোরিয়া'],
      },
      {
        id: 'comilla',
        name: 'কুমিল্লা',
        upazilas: ['কুমিল্লা আদর্শ সদর', 'দাউদকান্দি', 'চান্দিনা', 'দেবীদ্বার', 'লাকসাম'],
      },
    ],
  },
  {
    id: 'rajshahi',
    name: 'রাজশাহী',
    districts: [
      {
        id: 'raj-dist',
        name: 'রাজশাহী',
        upazilas: ['বোয়ালিয়া', 'রাজপাড়া', 'পবা', 'গোদাগাড়ী', 'বাঘা', 'চারঘাট'],
      },
      {
        id: 'bogra',
        name: 'বগুড়া',
        upazilas: ['বগুড়া সদর', 'শেরপুর', 'শিবগঞ্জ', 'কাহালু', 'দুপচাঁচিয়া'],
      },
      {
        id: 'natore',
        name: 'নাটোর',
        upazilas: ['নাটোর সদর', 'সিংড়া', 'বড়াইগ্রাম', 'গুরুদাসপুর'],
      },
    ],
  },
  {
    id: 'sylhet',
    name: 'সিলেট',
    districts: [
      {
        id: 'syl-dist',
        name: 'সিলেট',
        upazilas: ['সিলেট সদর', 'দক্ষিণ সুরমা', 'গোলাপগঞ্জ', 'বিয়ানীবাজার', 'জৈন্তাপুর'],
      },
      {
        id: 'moulvibazar',
        name: 'মৌলভীবাজার',
        upazilas: ['মৌলভীবাজার সদর', 'শ্রীমঙ্গল', 'কমলগঞ্জ', 'কুলাউড়া'],
      },
    ],
  },
  {
    id: 'khulna',
    name: 'খুলনা',
    districts: [
      {
        id: 'khul-dist',
        name: 'খুলনা',
        upazilas: ['খুলনা সদর', 'দৌলতপুর', 'খালিশপুর', 'বটিয়াঘাটা', 'ডুমুরিয়া', 'পাইকগাছা'],
      },
      {
        id: 'jashore',
        name: 'যশোর',
        upazilas: ['যশোর সদর', 'ঝিকরগাছা', 'অভয়নগর', 'বাঘারপাড়া', 'মনিরামপুর'],
      },
    ],
  },
  {
    id: 'barishal',
    name: 'বরিশাল',
    districts: [
      {
        id: 'bar-dist',
        name: 'বরিশাল',
        upazilas: ['বরিশাল সদর', 'বাকেরগঞ্জ', 'বাবুগঞ্জ', 'উজিরপুর', 'গৌরনদী'],
      },
      {
        id: 'patuakhali',
        name: 'পটুয়াখালী',
        upazilas: ['পটুয়াখালী সদর', 'কলাপাড়া', 'কুয়াকাটা', 'বাউফল', 'গলাচিপা'],
      },
    ],
  },
  {
    id: 'rangpur',
    name: 'রংপুর',
    districts: [
      {
        id: 'rang-dist',
        name: 'রংপুর',
        upazilas: ['রংপুর সদর', 'পীরগঞ্জ', 'মিঠাপুকুর', 'বদরগঞ্জ', 'কাউনিয়া'],
      },
      {
        id: 'dinajpur',
        name: 'দিনাজপুর',
        upazilas: ['দিনাজপুর সদর', 'পার্বতীপুর', 'বীরগঞ্জ', 'ফুলবাড়ী'],
      },
    ],
  },
  {
    id: 'mymensingh',
    name: 'ময়মনসিংহ',
    districts: [
      {
        id: 'mym-dist',
        name: 'ময়মনসিংহ',
        upazilas: ['ময়মনসিংহ সদর', 'মুক্তাগাছা', 'ত্রিশাল', 'ভালুকা', 'গফরগাঁও'],
      },
    ],
  },
];

export const divisionsData = bangladeshDivisions;
