![Housefly Logo](/apps/tutorial/public/housefly-logo.png)

# Housefly: Web Scraping için Uygulamalı Öğrenme Alanı

Housefly, yapılandırılmış meydan okumalar aracılığıyla web scraping öğretmek için tasarlanmış etkileşimli bir öğrenme projesidir. Her bölüm, özellikle scraping yapmak için oluşturulmuş bir yardımcı web sitesi içerir ve kontrollü bir ortamda pratik yapmanıza olanak tanır.

## Özellikler

* Gerçekçi Web Scraping Meydan Okumaları – Amaca özel olarak oluşturulmuş web siteleriyle çalışın.
* Yapılandırılmış Öğrenme – Rehberli egzersizlerle ilerleme kaydedin.
* Otomatik Çözüm Kontrolü – Scraper'larınızı beklenen çıktılara karşı doğrulayın.

## Başlangıç

1. Depoyu Klonlayın

```sh
git clone https://github.com/jonaylor89/housefly.git
cd housefly
```

2. Bölüm 1'e Gidin

Her bölüm, scraping yapmak için basit bir web sitesi ve doğru çıktıyı tanımlayan bir `expected.txt` dosyası içerir.

3. Scraper'ınızı Yazın

Çözümünüzü ilgili `solution{number}/` dizininde uygulayın.

4. Cevabınızı Kontrol Edin

Scraper'ınızın çıktısını expected.txt ile karşılaştırmak için doğrulama scriptini çalıştırın:

```sh
# npx install playwright (optionally for some exercises)
npm run ca 1
```

5. Env Değişkenlerini Ekleyin (İsteğe Bağlı)

Bazı meydan okumalar OpenAI gibi üçüncü taraf API'leri gerektirir ve bunlar için doldurabilir ve `.env` olarak yeniden adlandırarak kullanabileceğiniz bir `.env.template` dosyası bulunmaktadır

```
mv .env.template .env
```

## Proje Yapısı

```
housefly/
├── apps/
│   ├── chapter1/  # Bölüm 1 için web sitesi
│   │   ├── index.html
│   │   ├── package.json
│   ├── chapter2/
│   ├── chapter3/
│   ├── solution1/  # Bölüm 1 çözümünüzü buraya yerleştirin
│   │   ├── expected.(txt, csv, json)
│   │   ├── index.ts
│   │   ├── package.json
├── scripts/
│   ├── check_answers.sh  # Çözümleri doğrulamak için script
```

## Katkıda Bulunma

Pull request'ler ve öneriler memnuniyetle karşılanır! Hata raporları veya özellik istekleri için özgürce issue açın.

## Lisans

MIT License

## Scraping'e Başlamaya Hazır mısınız?

👉 [Housefly'ı Şimdi Deneyin](https://housefly.cc)


## Feragatname

Bu eğitim amaçlıdır ve sizi istemeyen web sitelerinde web scraping yapmak ToS'ları ihlal edebilir ve endüstriyel ölçekte yapılırsa potansiyel olarak başınızı belaya sokabilir